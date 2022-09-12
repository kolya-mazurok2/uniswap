import { IExchangeStrategy } from '.';
import { Token, TokenWithWei } from '../../types';
import exchangeFactory from '../factories/exchange.factory';
import { JsonRpcSigner } from '@ethersproject/providers';

export class ExchangeWeiToTokenStrategy implements IExchangeStrategy {
  public async execute(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer?: JsonRpcSigner
  ) {
    const exchangeService = exchangeFactory.getService(toToken as Token);
    exchangeService.connect(signer!);
    await exchangeService.weiToTokenSwap(toAmount, fromAmount);
  }
}
