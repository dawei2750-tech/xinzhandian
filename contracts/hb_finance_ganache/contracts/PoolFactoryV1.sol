// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LedgerV2.sol";
import "./SavingsPoolV1.sol";
import "./Simple1967Proxy.sol";
import "./UpgradeableAdmin.sol";

contract PoolFactoryV1 is UpgradeableAdmin {
    LedgerV2 public ledger;
    address public poolImplementation;
    mapping(address => bool) public managers;
    address[] public pools;

    event ManagerSet(address indexed manager, bool allowed);
    event PoolCreated(address indexed pool, SavingsPoolV1.PoolType indexed poolType, address indexed asset);
    event PoolImplementationChanged(address indexed implementation);

    modifier onlyAdminOrManager() {
        if (msg.sender != admin && !managers[msg.sender]) revert Unauthorized();
        _;
    }

    function initialize(address initialAdmin, address ledgerAddress, address initialPoolImplementation) external {
        if (initialAdmin == address(0) || ledgerAddress == address(0) || initialPoolImplementation == address(0)) {
            revert InvalidAddress();
        }
        _initAdmin(initialAdmin);
        ledger = LedgerV2(ledgerAddress);
        poolImplementation = initialPoolImplementation;
    }

    function setManager(address manager, bool allowed) external {
        if (msg.sender != admin || manager == address(0)) revert Unauthorized();
        managers[manager] = allowed;
        emit ManagerSet(manager, allowed);
    }

    function setPoolImplementation(address implementation) external onlyAdminOrManager {
        if (implementation == address(0)) revert InvalidAddress();
        poolImplementation = implementation;
        emit PoolImplementationChanged(implementation);
    }

    function createFlexiblePool(address asset) external onlyAdminOrManager returns (address pool) {
        pool = address(new Simple1967Proxy(
            poolImplementation,
            abi.encodeCall(SavingsPoolV1.initialize, (admin, asset, address(ledger), SavingsPoolV1.PoolType.Flexible, 0))
        ));
        ledger.setAuthorizedPool(pool, true);
        pools.push(pool);
        emit PoolCreated(pool, SavingsPoolV1.PoolType.Flexible, asset);
    }

    function createFixedPool(address asset, uint16 maxTermDays) external onlyAdminOrManager returns (address pool) {
        pool = address(new Simple1967Proxy(
            poolImplementation,
            abi.encodeCall(SavingsPoolV1.initialize, (admin, asset, address(ledger), SavingsPoolV1.PoolType.Fixed, maxTermDays))
        ));
        ledger.setAuthorizedPool(pool, true);
        pools.push(pool);
        emit PoolCreated(pool, SavingsPoolV1.PoolType.Fixed, asset);
    }

    function getPools() external view returns (address[] memory) {
        return pools;
    }
}
