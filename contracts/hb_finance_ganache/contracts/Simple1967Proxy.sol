// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Simple1967Proxy {
    bytes32 internal constant IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address implementation, bytes memory initialization) payable {
        _validateImplementation(implementation);
        assembly ("memory-safe") {
            sstore(IMPLEMENTATION_SLOT, implementation)
        }
        if (initialization.length != 0) {
            (bool ok, bytes memory reason) = implementation.delegatecall(initialization);
            if (!ok) {
                if (reason.length == 0) revert("Proxy initialization failed");
                assembly ("memory-safe") {
                    revert(add(reason, 32), mload(reason))
                }
            }
        }
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function _delegate() private {
        assembly ("memory-safe") {
            let implementation := sload(IMPLEMENTATION_SLOT)
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    function _validateImplementation(address implementation) private view {
        require(implementation.code.length != 0, "Invalid implementation");
        (bool ok, bytes memory result) = implementation.staticcall(abi.encodeWithSignature("proxiableUUID()"));
        require(ok && result.length == 32 && abi.decode(result, (bytes32)) == IMPLEMENTATION_SLOT, "Unsupported implementation");
    }
}
