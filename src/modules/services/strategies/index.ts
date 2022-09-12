import { TokenWithWei } from '../../types';
import { JsonRpcSigner } from '@ethersproject/providers';

export interface IExchangeStrategy {
  execute: (
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer?: JsonRpcSigner
  ) => Promise<void>;
}

export * from './exchange-token-to-token.strategy';
export * from './exchange-token-to-wei.strategy';
export * from './exchange-wei-to-token.strategy';
