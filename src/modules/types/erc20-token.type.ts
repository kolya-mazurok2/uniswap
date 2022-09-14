import { BigNumber } from 'ethers';

export interface IExchange {
  name: string;
  symbol: string;
  reserve: BigNumber;
  price: BigNumber;
}

export type Token = 'Primary' | 'Secondary';
export type TokenWithWei = Token | 'Wei';

export const TOKENS: Token[] = ['Primary', 'Secondary'];
export const TOKENS_WITH_ETH: TokenWithWei[] = [...TOKENS, 'Wei'];

export const EXCHANGES = [...TOKENS];
