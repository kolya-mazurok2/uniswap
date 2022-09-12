import { BigNumber } from 'ethers';

export interface IERC20Token {
  name: string;
  symbol: string;
  totalSupply: BigNumber;
  price: BigNumber;
}

export type Token = 'Primary' | 'Secondary';
export type TokenWithWei = Token | 'Wei';

export const TOKENS: Token[] = ['Primary', 'Secondary'];
export const TOKENS_WITH_ETH: TokenWithWei[] = [...TOKENS, 'Wei'];

export const EXCHANGES = [...TOKENS];
