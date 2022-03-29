// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BubToken.sol';
import './Ownable.sol';

contract StakerApp is Ownable{
    
    address private _owner;
    BubToken private bubToken;
    address[] public stakers;
    uint public tokenBuyPrice = 100;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => uint) stakersArrayIndexes;

    constructor(BubToken _bubToken) {
        bubToken = _bubToken;
        _owner = msg.sender;
        uint8 dec = bubToken._decimals();
        bubToken._mint(msg.sender, 1000 * 10 ** dec); 
    }

    function modifyTokenBuyPrice(uint newPrice) public onlyOwner {
        tokenBuyPrice = newPrice;
    }

    function removeElementfromStakers(uint index) public{
        stakers[index] = stakers[stakers.length - 1];
        stakersArrayIndexes[stakers[index]] = index;
        stakers.pop();
    }

    function buyToken() public payable {
        address receiver = msg.sender;
        uint value = msg.value * tokenBuyPrice;
        bubToken.buyToken(receiver, value);
    }

    function stakeToken(uint numOfTokens) public {
        require(numOfTokens > 0, 'Supply value less than zero');
        uint8 dec = bubToken._decimals();
        uint lowestForm = numOfTokens * 10 ** dec;
        require(lowestForm <= bubToken.balanceOf(msg.sender), 'Not enough tokens');
        bubToken.approve(msg.sender, numOfTokens * 10 ** dec);
        bubToken.transferFrom(msg.sender, address(this), numOfTokens * 10 ** dec);
        stakingBalance[msg.sender] += numOfTokens * 10 ** dec;
        if (!hasStaked[msg.sender]) {
            stakersArrayIndexes[msg.sender] = stakers.length;
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }
    }

    function unstakeToken(uint numOfTokens) public {
        uint8 dec = bubToken._decimals();
        uint lowestForm = numOfTokens * 10 ** dec;
        require(lowestForm <= stakingBalance[msg.sender], "You haven't staked up to this amount before.");
        bubToken.transfer(msg.sender, lowestForm);
        stakingBalance[msg.sender] -= lowestForm;
        if (stakingBalance[msg.sender] == 0) {
            removeElementfromStakers(stakersArrayIndexes[msg.sender]);
            hasStaked[msg.sender] = false;
        }
    }

    function claimRewards() public {
        require(stakingBalance[msg.sender] > 0, "You don't have token staked");
        stakingBalance[msg.sender] += stakingBalance[msg.sender] / 100;
    }

    function issueToken() public onlyOwner {
        for (uint i = 0; i < stakers.length; i++) {
            bubToken.transferFrom(address(_owner), stakers[i], stakingBalance[stakers[i]]);
        }
    }

    function getTokenBalance() public view returns (uint) {
        return bubToken.balanceOf(msg.sender);
    }

    function getAmountStaked() public view returns (uint) {
        return stakingBalance[msg.sender];
    }

    function transferTokens(address to, uint amount) public {
        uint8 dec = bubToken._decimals();
        uint lowestForm = amount * 10 ** dec;
        uint tokenBalance = getTokenBalance();
        require(lowestForm <= tokenBalance, "You don't have sufficient tokens");
        bubToken.approve(msg.sender, lowestForm);
        bubToken.transferFrom(msg.sender, to, lowestForm);
        
    }
}