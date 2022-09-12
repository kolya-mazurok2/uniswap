import { TokenWithWei } from '../../types';
import { IExchangeStrategy } from '../strategies';
import { JsonRpcSigner } from '@ethersproject/providers';

export class ExchangeContext {
  constructor(private strategy?: IExchangeStrategy) {}

  public setStrategy(strategy: IExchangeStrategy) {
    this.strategy = strategy;
  }

  public async executeStrategy(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer?: JsonRpcSigner
  ) {
    await this.strategy?.execute(fromToken, toToken, fromAmount, toAmount, signer);
  }
}
