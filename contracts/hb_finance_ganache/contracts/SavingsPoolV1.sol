// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LedgerV2.sol";
import "./UpgradeableAdmin.sol";

interface IPoolToken {
    function decimals() external view returns (uint8);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract SavingsPoolV1 is UpgradeableAdmin {
    enum PoolType { Flexible, Fixed }

    struct Tier { uint128 minimum; uint128 maximum; uint32 dailyRatePpm; bool enabled; }
    struct Position {
        address account;
        uint128 principal;
        uint64 openedAt;
        uint64 lastSettledAt;
        uint64 unlockAt;
        uint8 tierId;
        bool active;
    }

    uint32 public constant WINDOW_SECONDS = 4 hours;
    uint8 public constant MAX_WINDOWS_PER_SETTLEMENT = 6;
    uint16 public constant MIN_FIXED_TERM_DAYS = 7;

    IPoolToken public asset;
    uint8 public assetDecimals;
    LedgerV2 public ledger;
    PoolType public poolType;
    bool public paused;
    uint16 public maxFixedTermDays;
    uint64 public nextPositionId = 1;

    mapping(address => bool) public managers;
    mapping(uint8 => Tier) public tiers;
    mapping(uint64 => Position) public positions;
    mapping(address => uint64[]) private accountPositions;

    error InvalidValue();
    error Paused();
    error PositionUnavailable();
    error WindowIncomplete();
    error NotMatured();

    event ManagerSet(address indexed manager, bool allowed);
    event PauseSet(bool paused);
    event TierSet(uint8 indexed tierId, uint128 minimum, uint128 maximum, uint32 dailyRatePpm, bool enabled);
    event PositionOpened(uint64 indexed positionId, address indexed account, uint128 principal, uint8 tierId, uint64 unlockAt);
    event CommissionSettled(uint64 indexed positionId, address indexed account, uint256 ethAmount, uint32 windows, bool automatic);
    event PositionClosed(uint64 indexed positionId, address indexed account, uint128 principal);

    modifier onlyAdminOrManager() {
        if (msg.sender != admin && !managers[msg.sender]) revert Unauthorized();
        _;
    }

    modifier whenActive() {
        if (paused) revert Paused();
        _;
    }

    function initialize(address initialAdmin, address assetToken, address ledgerAddress, PoolType kind, uint16 initialMaxFixedTermDays)
        external
    {
        if (initialAdmin == address(0) || assetToken == address(0) || ledgerAddress == address(0)) revert InvalidValue();
        if (kind == PoolType.Fixed && initialMaxFixedTermDays < MIN_FIXED_TERM_DAYS) revert InvalidValue();
        _initAdmin(initialAdmin);
        asset = IPoolToken(assetToken);
        assetDecimals = IPoolToken(assetToken).decimals();
        ledger = LedgerV2(ledgerAddress);
        poolType = kind;
        maxFixedTermDays = initialMaxFixedTermDays;
    }

    function setManager(address manager, bool allowed) external {
        if (msg.sender != admin || manager == address(0)) revert Unauthorized();
        managers[manager] = allowed;
        emit ManagerSet(manager, allowed);
    }

    function setPaused(bool value) external onlyAdminOrManager {
        paused = value;
        emit PauseSet(value);
    }

    function setMaxFixedTermDays(uint16 value) external onlyAdminOrManager {
        if (poolType != PoolType.Fixed || value < MIN_FIXED_TERM_DAYS) revert InvalidValue();
        maxFixedTermDays = value;
    }

    function setTier(uint8 tierId, uint128 minimum, uint128 maximum, uint32 dailyRatePpm, bool enabled)
        external onlyAdminOrManager
    {
        if (tierId == 0 || minimum == 0 || dailyRatePpm == 0 || (maximum != 0 && maximum < minimum)) revert InvalidValue();
        tiers[tierId] = Tier(minimum, maximum, dailyRatePpm, enabled);
        emit TierSet(tierId, minimum, maximum, dailyRatePpm, enabled);
    }

    function openFlexible(uint128 principal) external whenActive returns (uint64) {
        if (poolType != PoolType.Flexible) revert InvalidValue();
        uint8 tierId = _tierFor(principal);
        if (asset.balanceOf(msg.sender) < principal || asset.allowance(msg.sender, address(this)) < principal) revert InvalidValue();
        return _open(msg.sender, principal, tierId, 0);
    }

    function openFixed(uint128 principal, uint16 termDays) external whenActive returns (uint64) {
        if (poolType != PoolType.Fixed || termDays < MIN_FIXED_TERM_DAYS || termDays > maxFixedTermDays) revert InvalidValue();
        uint8 tierId = _tierFor(principal);
        if (!asset.transferFrom(msg.sender, address(this), principal)) revert InvalidValue();
        return _open(msg.sender, principal, tierId, uint64(block.timestamp + uint256(termDays) * 1 days));
    }

    function claim(uint64 positionId) external whenActive returns (uint256) {
        Position storage position = _ownedActive(positionId, msg.sender);
        return _settle(positionId, position, false);
    }

    function settleAutomatic(uint64[] calldata positionIds) external onlyAdminOrManager whenActive {
        for (uint256 i; i < positionIds.length; ++i) {
            Position storage position = positions[positionIds[i]];
            if (!position.active) continue;
            _settle(positionIds[i], position, true);
        }
    }

    function closeFlexible(uint64 positionId) external whenActive {
        if (poolType != PoolType.Flexible) revert InvalidValue();
        Position storage position = _ownedActive(positionId, msg.sender);
        if (block.timestamp >= uint256(position.lastSettledAt) + WINDOW_SECONDS) _settle(positionId, position, false);
        position.active = false;
        emit PositionClosed(positionId, msg.sender, position.principal);
    }

    function withdrawFixed(uint64 positionId) external whenActive {
        if (poolType != PoolType.Fixed) revert InvalidValue();
        Position storage position = _ownedActive(positionId, msg.sender);
        if (block.timestamp < position.unlockAt) revert NotMatured();
        if (block.timestamp >= uint256(position.lastSettledAt) + WINDOW_SECONDS) _settle(positionId, position, false);
        position.active = false;
        if (!asset.transfer(msg.sender, position.principal)) revert InvalidValue();
        emit PositionClosed(positionId, msg.sender, position.principal);
    }

    function getAccountPositions(address account) external view returns (uint64[] memory) {
        return accountPositions[account];
    }

    function _open(address account, uint128 principal, uint8 tierId, uint64 unlockAt) private returns (uint64 positionId) {
        positionId = nextPositionId++;
        positions[positionId] = Position(account, principal, uint64(block.timestamp), uint64(block.timestamp), unlockAt, tierId, true);
        accountPositions[account].push(positionId);
        emit PositionOpened(positionId, account, principal, tierId, unlockAt);
    }

    function _settle(uint64 positionId, Position storage position, bool automatic) private returns (uint256 ethAmount) {
        uint256 elapsed = block.timestamp - position.lastSettledAt;
        uint32 windows = uint32(elapsed / WINDOW_SECONDS);
        if (windows == 0) revert WindowIncomplete();
        if (windows > MAX_WINDOWS_PER_SETTLEMENT) windows = MAX_WINDOWS_PER_SETTLEMENT;
        if (
            poolType == PoolType.Flexible &&
            (asset.balanceOf(position.account) < position.principal || asset.allowance(position.account, address(this)) < position.principal)
        ) {
            revert InvalidValue();
        }
        Tier memory tier = tiers[position.tierId];
        ethAmount = ledger.quoteEthCommission(position.principal, assetDecimals, tier.dailyRatePpm, windows);
        position.lastSettledAt += uint64(uint256(windows) * WINDOW_SECONDS);
        ledger.creditEthCommission(position.account, ethAmount);
        emit CommissionSettled(positionId, position.account, ethAmount, windows, automatic);
    }

    function _tierFor(uint128 principal) private view returns (uint8) {
        uint8 upper = poolType == PoolType.Flexible ? 9 : 1;
        for (uint8 tierId = 1; tierId <= upper; ++tierId) {
            Tier memory tier = tiers[tierId];
            if (tier.enabled && principal >= tier.minimum && (tier.maximum == 0 || principal <= tier.maximum)) return tierId;
        }
        revert InvalidValue();
    }

    function _ownedActive(uint64 positionId, address account) private view returns (Position storage position) {
        position = positions[positionId];
        if (!position.active || position.account != account) revert PositionUnavailable();
    }
}
