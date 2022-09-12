import { ethers } from 'ethers';
import { exchangeABI, tokenABI } from '../../abis';
import { CONTRACT_ADDRESSES } from './app-keys.const';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const primaryTokenContract = new ethers.Contract(
  CONTRACT_ADDRESSES.tokens.Primary,
  tokenABI,
  provider
);

export const secondaryTokenContract = new ethers.Contract(
  CONTRACT_ADDRESSES.tokens.Secondary,
  tokenABI,
  provider
);

export const primaryExchangeContract = new ethers.Contract(
  CONTRACT_ADDRESSES.exchanges.Primary,
  exchangeABI,
  provider
);

export const secondaryExchangeContract = new ethers.Contract(
  CONTRACT_ADDRESSES.exchanges.Secondary,
  exchangeABI,
  provider
);
