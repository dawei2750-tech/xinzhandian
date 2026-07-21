// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockEthUsdFeed {
    uint8 public constant decimals = 8;
    int256 private answer;
    uint256 private updatedAt;

    constructor(int256 initialAnswer) {
        answer = initialAnswer;
        updatedAt = block.timestamp;
    }

    function setAnswer(int256 newAnswer) external {
        answer = newAnswer;
        updatedAt = block.timestamp;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, answer, updatedAt, updatedAt, 1);
    }
}
