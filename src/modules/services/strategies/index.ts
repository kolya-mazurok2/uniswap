import { TokenWithWei } from '../../types';
import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export interface IExchangeStrategy {
  executeSwap: (
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer: JsonRpcSigner
  ) => Promise<void>;

  executeGetAmount: (
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer: JsonRpcSigner
  ) => Promise<BigNumber>;

  executeGetPriceImpact: (
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer: JsonRpcSigner
  ) => Promise<number>;
}

export * from './exchange-token-to-token.strategy';
export * from './exchange-token-to-wei.strategy';
export * from './exchange-wei-to-token.strategy';
