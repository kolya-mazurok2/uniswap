import { BigNumber, Contract } from 'ethers';
import {
  primaryExchangeContract,
  primaryTokenContract,
  secondaryExchangeContract,
  secondaryTokenContract
} from '../common/consts';
import { IERC20Token } from '../types';

export class ERC20TokenService {
  constructor(private tokenContract: Contract, private exchangeContract: Contract) {}

  public async getToken(): Promise<IERC20Token> {
    const name = await this.tokenContract.name();
    const symbol = await this.tokenContract.symbol();
    const totalSupply = await this.tokenContract.totalSupply();
    const price = await this.getPrice();

    return { name, symbol, totalSupply, price };
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

export const primaryTokenService = new ERC20TokenService(
  primaryTokenContract,
  primaryExchangeContract
);

export const secondaryTokenService = new ERC20TokenService(
  secondaryTokenContract,
  secondaryExchangeContract
);
