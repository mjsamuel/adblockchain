// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Adblock {
    struct Creator {
        address payable creatorAddress;
        uint8 costPerView;
    }
    
    // Solidity will auto generate a  getter function to get any creator from
    // this mapping. The cost to access this method is $0 USD
    mapping (bytes32 => Creator) public creators;
    
    constructor() public {
        // Deploying the contract to the blockchain:
        // 213657 gas = $4.05092 USD
    }
    
    function newCreator(bytes32 domainName, address creatorAddress, uint8 costPerView) external {
        // Every time a new creator is added to the contract: 
        // 42249 gas = $0.83444 USD
        creators[domainName] = Creator(address(uint160(creatorAddress)), costPerView);
    }
    
    function setCreatorCost(bytes32 domainName, uint8 costPerView) external {
        // Modifying the creator object:
        // 22197 gas = $0.42087
        require(msg.sender == creators[domainName].creatorAddress);
        creators[domainName].costPerView = costPerView;
    }
    
    function payCreator(bytes32 domainName) external payable {
        // Remix states the method has `infinite cost`, guessing that this is 
        // because the contract can receive any amount of Ethereum to forward 
        // to the creator
        require(msg.value == creators[domainName].costPerView);
        creators[domainName].creatorAddress.transfer(msg.value);
    }
}
