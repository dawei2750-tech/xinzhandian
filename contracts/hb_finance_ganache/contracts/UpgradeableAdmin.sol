// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract UpgradeableAdmin {
    bytes32 public constant IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    address public admin;
    bool private _adminInitialized;

    error Unauthorized();
    error InvalidAddress();
    error AlreadyInitialized();
    error InvalidImplementation();
    error UpgradeCallFailed();

    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event Upgraded(address indexed implementation);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert Unauthorized();
        _;
    }

    modifier initializer() {
        if (_adminInitialized) revert AlreadyInitialized();
        _adminInitialized = true;
        _;
    }

    function proxiableUUID() external pure returns (bytes32) {
        return IMPLEMENTATION_SLOT;
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert InvalidAddress();
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function upgradeTo(address newImplementation) external onlyAdmin {
        _authorizeUpgrade();
        _upgradeTo(newImplementation, "");
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable onlyAdmin {
        _authorizeUpgrade();
        _upgradeTo(newImplementation, data);
    }

    function _initAdmin(address initialAdmin) internal initializer {
        if (initialAdmin == address(0)) revert InvalidAddress();
        admin = initialAdmin;
    }

    function _authorizeUpgrade() internal view virtual {
        if (msg.sender != admin) revert Unauthorized();
    }

    function _upgradeTo(address newImplementation, bytes memory data) private {
        if (newImplementation.code.length == 0) revert InvalidImplementation();
        (bool ok, bytes memory result) = newImplementation.staticcall(abi.encodeWithSignature("proxiableUUID()"));
        if (!ok || result.length != 32 || abi.decode(result, (bytes32)) != IMPLEMENTATION_SLOT) {
            revert InvalidImplementation();
        }
        assembly ("memory-safe") {
            sstore(IMPLEMENTATION_SLOT, newImplementation)
        }
        if (data.length != 0) {
            (bool success,) = newImplementation.delegatecall(data);
            if (!success) revert UpgradeCallFailed();
        }
        emit Upgraded(newImplementation);
    }
}
