// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import {OracleReader} from "./OracleReader.sol";

contract FundMe2 {
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public totalAmountFunded;
    OracleReader public oracle;
    uint256 public constant MINIMUM_USD = 1 * 10 ** 18;
    uint public MINIMUM_ETH;

    constructor(address _oracleAddress) {
        owner = msg.sender;
        oracle = OracleReader(_oracleAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Need to be owner");
        _;
    }

    function fund() public payable {
        (uint256 neededValue, ) = oracle.read();
        MINIMUM_ETH = MINIMUM_USD / neededValue;
        require(msg.value > MINIMUM_ETH, "must be more than 0");
        balances[msg.sender] += msg.value;
        totalAmountFunded += msg.value;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(totalAmountFunded);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
