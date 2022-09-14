import { TokenWithWei } from '../../types';
import { JsonRpcSigner } from '@ethersproject/providers';
import { ExchangeStrategy } from '../strategies/exchange.strategy';

export class ExchangeContext {
  constructor(private strategy?: ExchangeStrategy) {}

  public setStrategy(strategy: ExchangeStrategy) {
    this.strategy = strategy;
  }

  public async swap(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer: JsonRpcSigner
  ) {
    return this.strategy?.executeSwap(fromToken, toToken, fromAmount, toAmount, signer);
  }

  public async getAmount(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer: JsonRpcSigner
  ) {
    return this.strategy?.executeGetAmount(fromToken, toToken, fromAmount, signer);
  }

  public async getPriceImpact(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer: JsonRpcSigner
  ) {
    return this.strategy?.executeGetPriceImpact(fromToken, toToken, fromAmount, signer);
  }
}
