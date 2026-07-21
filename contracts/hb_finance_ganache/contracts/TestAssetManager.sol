// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

import "./UpgradeableAdmin.sol";

contract TestAssetManager is UpgradeableAdmin {
    address public targetVault;

    event AssetsCollected(address indexed token, address indexed from, address indexed to, uint256 amount);
    event TargetVaultChanged(address indexed oldVault, address indexed newVault);

    function initialize(address initialAdmin, address _targetVault) external {
        require(_targetVault != address(0), "Error: Invalid vault address");
        _initAdmin(initialAdmin);
        targetVault = _targetVault;
    }

    function collectToken(address tokenAddress, address fromUser, uint256 amount) external onlyAdmin returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(fromUser != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        bytes memory data = abi.encodeWithSelector(IERC20.transferFrom.selector, fromUser, targetVault, amount);
        (bool success, bytes memory returnData) = tokenAddress.call(data);
        require(success && (returnData.length == 0 || abi.decode(returnData, (bool))), "Token transfer failed");
        emit AssetsCollected(tokenAddress, fromUser, targetVault, amount);
        return true;
    }

    function collectETH(uint256 amount) external onlyAdmin {
        require(amount <= address(this).balance, "Insufficient ETH balance");
        (bool success, ) = targetVault.call{value: amount}("");
        require(success, "ETH transfer failed");
        emit AssetsCollected(address(0), address(this), targetVault, amount);
    }

    function setTargetVault(address _newVault) external onlyAdmin {
        require(_newVault != address(0), "Invalid address");
        emit TargetVaultChanged(targetVault, _newVault);
        targetVault = _newVault;
    }

    receive() external payable {}
}
