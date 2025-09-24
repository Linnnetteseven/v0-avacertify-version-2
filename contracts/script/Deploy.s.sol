// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import {CertificateNFT} from "../src/CertificateNFT.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy with no constructor args to match CertificateNFT.sol
        CertificateNFT cert = new CertificateNFT();

        console2.log("=== DEPLOYMENT SUCCESSFUL ===");
        console2.log("CertificateNFT deployed at:", address(cert));
        console2.log("Network: Base Sepolia Testnet");
        console2.log("Chain ID: 84532");
        console2.log("=== COPY THIS ADDRESS TO lib/contracts.ts ===");
        
        vm.stopBroadcast();
    }
}
