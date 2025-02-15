// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract FundMe {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Need to be owner");
        _;
    }

    function fund() public payable {
        require(msg.value > 0, "must be more than 0");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
