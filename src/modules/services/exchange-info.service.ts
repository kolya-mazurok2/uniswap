import { BigNumber, Contract } from 'ethers';
import {
  primaryExchangeContract,
  primaryTokenContract,
  secondaryExchangeContract,
  secondaryTokenContract
} from '../common/consts';
import { IExchange } from '../types';

export class ExchangeInfoService {
  constructor(private tokenContract: Contract, private exchangeContract: Contract) {}

  public async getToken(): Promise<IExchange> {
    const name = await this.tokenContract.name();
    const symbol = await this.tokenContract.symbol();
    const reserve = await this.exchangeContract.getReserve();
    const price = await this.getPrice();

    return { name, symbol, reserve, price };
  }

  public async getPrice(): Promise<BigNumber> {
    try {
      const price = await this.exchangeContract.getWeiAmount(1);
      return price;
    } catch {
      return BigNumber.from(0);
    }
  }
}

export const primaryExchangeInfoService = new ExchangeInfoService(
  primaryTokenContract,
  primaryExchangeContract
);

export const secondaryExchangeInfoService = new ExchangeInfoService(
  secondaryTokenContract,
  secondaryExchangeContract
);
