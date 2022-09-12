// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import './Exchange.sol';

contract Factory {
  mapping(address => address) public tokenToExchange;

  function createExchange(address _tokenAddress) public returns (address) {
    require(_tokenAddress != address(0), 'E1');
    require(tokenToExchange[_tokenAddress] == address(0), 'E3');

    Exchange exchange = new Exchange(_tokenAddress);
    address exchangeAddress = address(exchange);
    tokenToExchange[_tokenAddress] = exchangeAddress;

    return exchangeAddress;
  }

  function getExchange(address _tokenAddress) public view returns (address) {
    return tokenToExchange[_tokenAddress];
  }
}
