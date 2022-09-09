// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IExchange {
  function weiToTokenSwap(uint256 _minTokens) external payable;

  function weiToTokenTransfer(uint256 _minTokens, address _recipient) external payable;
}

interface IFactory {
  function getExchange(address _tokenAddress) external returns (address);
}

contract Exchange is ERC20 {
  address public tokenAddress;
  address public factoryAddress;

  constructor(address _token) ERC20('Uniswap', 'UNI') {
    require(_token != address(0), 'E1');

    tokenAddress = _token;
    factoryAddress = msg.sender;
  }

  function addLiquidity(uint256 _tokenAmount) public payable returns (uint256) {
    uint256 liquidity = 0;
    if (getReserve() == 0) {
      liquidity = address(this).balance;
    } else {
      uint256 weiReserve = address(this).balance - msg.value;
      uint256 tokenReserve = getReserve();
      uint256 tokenAmount = (msg.value * tokenReserve) / weiReserve;
      require(_tokenAmount >= tokenAmount, 'E2');
      liquidity = (totalSupply() * msg.value) / weiReserve;
    }

    IERC20 token = IERC20(tokenAddress);
    token.transferFrom(msg.sender, address(this), _tokenAmount);

    _mint(msg.sender, liquidity);

    return liquidity;
  }

  function removeLiquidity(uint256 _amount) public returns (uint256, uint256) {
    require(_amount > 0, 'E2');

    uint256 weiAmount = (address(this).balance * _amount) / totalSupply();
    uint256 tokenAmount = (getReserve() * _amount) / totalSupply();

    _burn(msg.sender, _amount);
    payable(msg.sender).transfer(weiAmount);
    IERC20(tokenAddress).transfer(msg.sender, tokenAmount);

    return (weiAmount, tokenAmount);
  }

  function getReserve() public view returns (uint256) {
    return IERC20(tokenAddress).balanceOf(address(this));
  }

  function getTokenAmount(uint256 _weiAmount) public view returns (uint256) {
    require(_weiAmount > 0, 'E2');

    return getAmount(_weiAmount, address(this).balance, getReserve());
  }

  function getWeiAmount(uint256 _tokenAmount) public view returns (uint256) {
    require(_tokenAmount > 0, 'E2');

    return getAmount(_tokenAmount, getReserve(), address(this).balance);
  }

  function tokenToWeiSwap(uint256 _tokensAmount, uint256 _weiRequested) public payable {
    uint256 weiBought = getAmount(_tokensAmount, getReserve(), address(this).balance);

    require(weiBought >= _weiRequested, 'E2');

    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokensAmount);

    payable(msg.sender).transfer(weiBought);
  }

  function weiToTokenSwap(uint256 _tokensRequested) public payable {
    weiToToken(_tokensRequested, msg.sender);
  }

  function weiToTokenTransfer(uint256 _tokensRequested, address _recipient) public payable {
    weiToToken(_tokensRequested, _recipient);
  }

  function tokenToTokenSwap(
    uint256 _tokensSold,
    uint256 _tokensBought,
    address _tokenAddress
  ) public {
    address exchangeAddress = IFactory(factoryAddress).getExchange(_tokenAddress);

    require(
      exchangeAddress != address(this) && exchangeAddress != address(0),
      'E1'
    );

    uint256 weiBought = getAmount(_tokensSold, getReserve(), address(this).balance);

    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokensSold);

    IExchange(exchangeAddress).weiToTokenTransfer{value: weiBought}(_tokensBought, msg.sender);
  }

  function weiToToken(uint256 _tokensRequested, address _recipient) private {
    uint256 tokensBought = getAmount(msg.value, address(this).balance - msg.value, getReserve());

    require(tokensBought >= _tokensRequested, 'E2');

    IERC20(tokenAddress).transfer(_recipient, tokensBought);
  }

  function getAmount(
    uint256 inputAmount,
    uint256 inputReserve,
    uint256 outputReserve
  ) private pure returns (uint256) {
    require(inputReserve > 0 && outputReserve > 0, 'E2');

    uint256 inputAmountWithFee = inputAmount * 997;

    return (inputAmountWithFee * outputReserve) / (inputReserve * 1000 + inputAmountWithFee);
  }
}
