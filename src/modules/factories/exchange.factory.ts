import { ExchangeService } from '../services/exchange.service';
import { Token } from '../types';
import { getExchangeContract, getTokenContract } from '../utils';

export class ExchangeFactory {
  getService(type: Token) {
    return new ExchangeService(type, getTokenContract(type), getExchangeContract(type));
  }
}

const exchangeFactory = new ExchangeFactory();
export default exchangeFactory;
