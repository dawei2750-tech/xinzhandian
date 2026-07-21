// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleMultiSigAdmin {
    struct Proposal {
        address target;
        uint256 value;
        bytes data;
        uint256 approvals;
        bool executed;
    }

    mapping(address => bool) public isSigner;
    address[] public signers;
    uint256 public immutable requiredApprovals;
    uint256 public nextProposalId = 1;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public approvedBy;

    error Unauthorized();
    error InvalidValue();
    error AlreadyApproved();
    error AlreadyExecuted();
    error NotEnoughApprovals();
    error CallFailed();

    event ProposalCreated(uint256 indexed proposalId, address indexed target, uint256 value, bytes data);
    event ProposalApproved(uint256 indexed proposalId, address indexed signer, uint256 approvals);
    event ProposalExecuted(uint256 indexed proposalId);

    modifier onlySigner() {
        if (!isSigner[msg.sender]) revert Unauthorized();
        _;
    }

    constructor(address[] memory initialSigners, uint256 threshold) {
        if (threshold == 0 || initialSigners.length < threshold) revert InvalidValue();
        requiredApprovals = threshold;
        for (uint256 i; i < initialSigners.length; ++i) {
            address signer = initialSigners[i];
            if (signer == address(0) || isSigner[signer]) revert InvalidValue();
            isSigner[signer] = true;
            signers.push(signer);
        }
    }

    receive() external payable {}

    function signerCount() external view returns (uint256) {
        return signers.length;
    }

    function propose(address target, uint256 value, bytes calldata data) external onlySigner returns (uint256 proposalId) {
        if (target == address(0)) revert InvalidValue();
        proposalId = nextProposalId++;
        proposals[proposalId] = Proposal(target, value, data, 0, false);
        emit ProposalCreated(proposalId, target, value, data);
    }

    function approve(uint256 proposalId) external onlySigner {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.target == address(0)) revert InvalidValue();
        if (proposal.executed) revert AlreadyExecuted();
        if (approvedBy[proposalId][msg.sender]) revert AlreadyApproved();
        approvedBy[proposalId][msg.sender] = true;
        proposal.approvals += 1;
        emit ProposalApproved(proposalId, msg.sender, proposal.approvals);
    }

    function execute(uint256 proposalId) external onlySigner returns (bytes memory result) {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.target == address(0)) revert InvalidValue();
        if (proposal.executed) revert AlreadyExecuted();
        if (proposal.approvals < requiredApprovals) revert NotEnoughApprovals();
        proposal.executed = true;
        (bool success, bytes memory data) = proposal.target.call{value: proposal.value}(proposal.data);
        if (!success) revert CallFailed();
        emit ProposalExecuted(proposalId);
        return data;
    }
}
