// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import './Exchange.sol';

contract Factory {
  mapping(address => address) public tokenToExchange;

  event ExchangeCreated(address _creator, address _tokenAddress, address _exchangeAddress);

  function createExchange(address _tokenAddress) public returns (address) {
    require(_tokenAddress != address(0), 'E1');
    require(tokenToExchange[_tokenAddress] == address(0), 'E3');

    Exchange exchange = new Exchange(_tokenAddress);
    tokenToExchange[_tokenAddress] = address(exchange);

    emit ExchangeCreated(address(this), _tokenAddress, address(exchange));

    return address(exchange);
  }

  function getExchange(address _tokenAddress) public view returns (address) {
    return tokenToExchange[_tokenAddress];
  }
}
