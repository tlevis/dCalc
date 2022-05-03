// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/utils/Strings.sol";


contract Calculator {
    struct User {
        //uint256 balance;
        bool valid;
        uint registrationDate;
    }

    uint128 constant REGISTREATION_AMOUNT = 1000000000000000; // 0.001 ETH
    uint128 constant MONTH_IN_SECONDS = 2592000; // 30 days in seconds
    
    address private owner;
    address[] private users;

    //TODO: Add option to change the current price of the subscription

    mapping(address => User) public registeredAddresses;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier isRegistered {
        require(registeredAddresses[msg.sender].valid, "Your account is not valid");
        _;
    }    

    constructor() {
        owner = msg.sender;
    }

    function add(int256 _x, int256 _y) public isRegistered view returns (int256) {
        return _x + _y;
    }

    function sub(int256 _x, int256 _y) public isRegistered view returns (int256) {
        return _x - _y;
    }
    
    function mul(int256 _x, int256 _y) public isRegistered view returns (int256) {
        return _x * _y;
    }

    function div(uint256 _x, uint256 _y) public isRegistered view returns (string memory result) {
        require(_y != 0, "You cannot divied by 0");
        // Since we cannot use decimals, let's make a 10^2 factor to add 2 decimal points and return it as a string
        uint256 factor = 100; 
        uint256 quotient  = _x / _y;
        uint256 remainder = (_x * factor / _y) % factor;
        result = string(abi.encodePacked(Strings.toString(quotient), '.', Strings.toString(remainder)));
    }

    function healthCheck() public pure returns (int8) {
        return 1;
    }

    function checkUser() public isRegistered view returns (uint) {
        return registeredAddresses[msg.sender].registrationDate;
    }    
    
    function register() public payable returns (uint) {
        require(msg.value == REGISTREATION_AMOUNT, 
            string(abi.encodePacked(
                "We accept only ", 
                Strings.toString(REGISTREATION_AMOUNT), 
                ", but we received ", 
                Strings.toString(msg.value))
            )
        );

        users.push(msg.sender);
        registeredAddresses[msg.sender].valid = true;
        registeredAddresses[msg.sender].registrationDate = block.timestamp;
        return registeredAddresses[msg.sender].registrationDate;
    }

    
    function refund() public isRegistered payable {
        if ( (block.timestamp - registeredAddresses[msg.sender].registrationDate) < MONTH_IN_SECONDS) {
            payable(msg.sender).transfer(REGISTREATION_AMOUNT);
            delete registeredAddresses[msg.sender];
            for (uint i = 0; i < users.length; i++) {
                if (users[i] == msg.sender) {
                    delete users[i];
                    break;
                }
            }
        } else {
            revert("Sorry, but you can't get refund after 30 days");    
        }
    }    

    function withdraw() payable onlyOwner public {
        uint256 availableBalance = 0;
        
        for (uint256 idx = 0; idx < users.length; idx++){
            address user = users[idx];
            if ( (block.timestamp - registeredAddresses[user].registrationDate) > MONTH_IN_SECONDS) {
                availableBalance += REGISTREATION_AMOUNT;
            }
        }
        payable(msg.sender).transfer(availableBalance);
    }
    
}