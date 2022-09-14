import { Token, TokenWithWei } from '../../types';
import exchangeFactory from '../factories/exchange.factory';
import { CONTRACT_ADDRESSES } from '../../common/consts/app-keys.const';
import { ExchangeStrategy } from './exchange.strategy';
import { BigNumber } from 'ethers';

export class ExchangeTokenToTokenStrategy extends ExchangeStrategy {
  constructor() {
    super();
  }

  protected async getExchangeService(fromToken: TokenWithWei, _: TokenWithWei) {
    return exchangeFactory.getService(fromToken as Token);
  }

  protected async swap(from: number, to: number) {
    await this.exchangeService?.tokenToTokenSwap(
      from,
      to,
      CONTRACT_ADDRESSES.tokens[this.toToken as Token]
    );
  }

  protected async getAmount(inputValue: number) {
    //TODO
    return BigNumber.from(0);
  }

  protected async getPriceImpact(inputValue: number) {
    //TODO
    return 0;
  }
}
