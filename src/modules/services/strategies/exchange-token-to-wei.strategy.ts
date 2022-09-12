import { IExchangeStrategy } from '.';
import { Token, TokenWithWei } from '../../types';
import { JsonRpcSigner } from '@ethersproject/providers';
import exchangeFactory from '../factories/exchange.factory';

export class ExchangeTokenToWeiStrategy implements IExchangeStrategy {
  public async execute(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer?: JsonRpcSigner
  ) {
    const exchangeService = exchangeFactory.getService(fromToken as Token);
    exchangeService.connect(signer!);
    await exchangeService.tokenToWeiSwap(fromAmount, toAmount);
  }
}
