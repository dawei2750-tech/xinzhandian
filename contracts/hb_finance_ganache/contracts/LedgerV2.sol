// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILedgerToken {
    function decimals() external view returns (uint8);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IEthUsdFeed {
    function decimals() external view returns (uint8);
    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80);
}

import "./UpgradeableAdmin.sol";

contract LedgerV2 is UpgradeableAdmin {
    uint16 public constant BPS = 10_000;
    uint32 public constant PPM = 1_000_000;
    uint8 public constant WINDOWS_PER_DAY = 6;

    ILedgerToken public usdc;
    IEthUsdFeed public priceFeed;
    uint32 public maxPriceAge;
    address public operationPool;
    uint16 public exchangeFeeBps;

    mapping(address => bool) public managers;
    mapping(address => bool) public authorizedPools;
    mapping(address => uint256) public ethRewardOf;
    mapping(address => uint256) public usdcCreditOf;
    mapping(address => mapping(address => uint256)) public poolEthRewardOf;

    error InvalidValue();
    error StalePrice();
    error InsufficientReward();
    error InsufficientLiquidity();

    event ManagerSet(address indexed manager, bool allowed);
    event PoolAuthorized(address indexed pool, bool allowed);
    event PriceFeedSet(address indexed feed, uint32 maxAge);
    event ExchangeFeeSet(uint16 feeBps, address indexed operationPool);
    event EthCommissionCredited(address indexed pool, address indexed account, uint256 amount);
    event EthExchanged(address indexed account, uint256 ethAmount, uint256 usdcAmount, uint256 fee);
    event UsdcWithdrawn(address indexed account, uint256 amount);

    modifier onlyAdminOrManager() {
        if (msg.sender != admin && !managers[msg.sender]) revert Unauthorized();
        _;
    }

    modifier onlyPool() {
        if (!authorizedPools[msg.sender]) revert Unauthorized();
        _;
    }

    function initialize(address initialAdmin, address usdcAsset, address ethUsdFeed, uint32 initialMaxPriceAge) external {
        if (initialAdmin == address(0) || usdcAsset == address(0) || ethUsdFeed == address(0) || initialMaxPriceAge == 0) {
            revert InvalidAddress();
        }
        _initAdmin(initialAdmin);
        usdc = ILedgerToken(usdcAsset);
        priceFeed = IEthUsdFeed(ethUsdFeed);
        maxPriceAge = initialMaxPriceAge;
    }

    function setManager(address manager, bool allowed) external {
        if (msg.sender != admin || manager == address(0)) revert Unauthorized();
        managers[manager] = allowed;
        emit ManagerSet(manager, allowed);
    }

    function setAuthorizedPool(address pool, bool allowed) external onlyAdminOrManager {
        if (pool == address(0)) revert InvalidAddress();
        authorizedPools[pool] = allowed;
        emit PoolAuthorized(pool, allowed);
    }

    function setPriceFeed(address feed, uint32 newMaxPriceAge) external onlyAdminOrManager {
        if (feed == address(0) || newMaxPriceAge == 0) revert InvalidAddress();
        priceFeed = IEthUsdFeed(feed);
        maxPriceAge = newMaxPriceAge;
        emit PriceFeedSet(feed, newMaxPriceAge);
    }

    function setExchangeFee(uint16 feeBps, address newOperationPool) external onlyAdminOrManager {
        if (feeBps > BPS || (feeBps != 0 && newOperationPool == address(0))) revert InvalidValue();
        exchangeFeeBps = feeBps;
        operationPool = newOperationPool;
        emit ExchangeFeeSet(feeBps, newOperationPool);
    }

    function quoteEthCommission(uint256 principal, uint8 assetDecimals, uint32 dailyRatePpm, uint32 windows)
        public view returns (uint256)
    {
        if (principal == 0 || dailyRatePpm == 0 || windows == 0 || assetDecimals > 18) revert InvalidValue();
        (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();
        if (answer <= 0 || updatedAt == 0 || updatedAt + maxPriceAge < block.timestamp) revert StalePrice();
        uint256 feedScale = 10 ** uint256(priceFeed.decimals());
        uint256 assetScale = 10 ** uint256(assetDecimals);
        return principal * dailyRatePpm * windows * feedScale * 1e18 / assetScale / PPM / WINDOWS_PER_DAY / uint256(answer);
    }

    function creditEthCommission(address account, uint256 amount) external onlyPool {
        if (account == address(0) || amount == 0) revert InvalidValue();
        ethRewardOf[account] += amount;
        poolEthRewardOf[msg.sender][account] += amount;
        emit EthCommissionCredited(msg.sender, account, amount);
    }

    function previewUsdc(uint256 ethAmount) public view returns (uint256 gross, uint256 fee, uint256 net) {
        if (ethAmount == 0) revert InvalidValue();
        (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();
        if (answer <= 0 || updatedAt == 0 || updatedAt + maxPriceAge < block.timestamp) revert StalePrice();
        gross = ethAmount * uint256(answer) * (10 ** uint256(usdc.decimals())) / 1e18 / (10 ** uint256(priceFeed.decimals()));
        fee = gross * exchangeFeeBps / BPS;
        net = gross - fee;
    }

    function exchangeEthForUsdc(uint256 ethAmount) external {
        if (ethRewardOf[msg.sender] < ethAmount) revert InsufficientReward();
        (uint256 gross, uint256 fee, uint256 net) = previewUsdc(ethAmount);
        if (usdc.balanceOf(address(this)) < gross) revert InsufficientLiquidity();
        ethRewardOf[msg.sender] -= ethAmount;
        usdcCreditOf[msg.sender] += net;
        if (fee != 0 && !usdc.transfer(operationPool, fee)) revert InsufficientLiquidity();
        emit EthExchanged(msg.sender, ethAmount, net, fee);
    }

    function withdrawUsdc(uint256 amount) external {
        if (amount == 0 || usdcCreditOf[msg.sender] < amount || usdc.balanceOf(address(this)) < amount) {
            revert InsufficientLiquidity();
        }
        usdcCreditOf[msg.sender] -= amount;
        if (!usdc.transfer(msg.sender, amount)) revert InsufficientLiquidity();
        emit UsdcWithdrawn(msg.sender, amount);
    }
}
