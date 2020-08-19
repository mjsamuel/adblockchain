// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract AdblockIPFS is usingProvable {
    
    constructor() public {
        // Deploying the contract to the blockchain:
        // 214657 gas = $3.29841 USD
    }
    
    function getCreator(bytes32 domainName) external {
        // Will require a getCreator method to access the IPFS file. Infinite gas, 
        // possibly because it can't calculate the size of the file and the cost to retrieve Infinite
        // from Provable's API. There is some cost associated though
        bytes32 data = provable_query("IPFS", "QmdEJwJG1T9rzHvBD8i69HHuJaRgXRKEQCP7Bh1BVttZbU.domainName");
    }
    
    function newCreator() external {
        // Don't think we can write to the IPFS file using Provable's API
    }
    
    function setCreatorCost(bytes32 domainName, uint8 costPerView) external {
        // Infinite gas
        bytes32 data = provable_query("IPFS", "QmdEJwJG1T9rzHvBD8i69HHuJaRgXRKEQCP7Bh1BVttZbU.domainName");

        require(msg.sender == creators[domainName].creatorAddress);
        creators[domainName].costPerView = costPerView;
    }
        
    
}
