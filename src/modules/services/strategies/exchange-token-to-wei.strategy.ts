import { Token, TokenWithWei } from '../../types';
import exchangeFactory from '../factories/exchange.factory';
import { ExchangeStrategy } from './exchange.strategy';

export class ExchangeTokenToWeiStrategy extends ExchangeStrategy {
  constructor() {
    super();
  }

  protected async getExchangeService(fromToken: TokenWithWei, _: TokenWithWei) {
    return exchangeFactory.getService(fromToken as Token);
  }

  protected async swap(from: number, to: number) {
    return this.exchangeService?.tokenToWeiSwap(from, to);
  }

  protected async getAmount(inputValue: number) {
    return this.exchangeService?.getWeiAmount(inputValue);
  }

  protected async getPriceImpact(inputValue: number): Promise<any> {
    return this.exchangeService?.calcTokenToWeiPriceImpact(inputValue);
  }
}
