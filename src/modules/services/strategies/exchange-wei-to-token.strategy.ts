import { Token, TokenWithWei } from '../../types';
import exchangeFactory from '../factories/exchange.factory';
import { ExchangeStrategy } from './exchange.strategy';

export class ExchangeWeiToTokenStrategy extends ExchangeStrategy {
  constructor() {
    super();
  }

  protected async getExchangeService(_: TokenWithWei, toToken: TokenWithWei) {
    return exchangeFactory.getService(toToken as Token);
  }

  protected async swap(from: number, to: number) {
    return this.exchangeService?.weiToTokenSwap(from, to);
  }

  protected async getAmount(inputValue: number) {
    return this.exchangeService?.getTokenAmount(inputValue);
  }

  protected async getPriceImpact(inputValue: number): Promise<any> {
    return this.exchangeService?.calcWeiToTokenPriceImpact(inputValue);
  }
}
