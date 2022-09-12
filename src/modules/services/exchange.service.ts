import { Signer, providers, Contract } from 'ethers';
import { CONTRACT_ADDRESSES } from '../common/consts/app-keys.const';
import { Token } from '../types';

export class ExchangeService {
  constructor(
    private tokenName: Token,
    private tokenContract?: Contract,
    private exchangeContract?: Contract
  ) {}

  public connect(signer: providers.Provider | Signer) {
    this.tokenContract = this.tokenContract?.connect(signer);
    this.exchangeContract = this.exchangeContract?.connect(signer);
  }

  public async addLiquidity(amount: number, price: number) {
    await this.approveTokenTransfer(amount);

    const liquidityResponse = await this.exchangeContract?.addLiquidity(amount, {
      value: price
    });

    await liquidityResponse.wait();
  }

  public async weiToTokenSwap(tokensRequested: number, weiAmount: number) {
    const response = await this.exchangeContract?.weiToTokenSwap(tokensRequested, {
      value: weiAmount
    });
    await response.wait();
  }

  public async tokenToWeiSwap(weiRequested: number, tokenAmount: number) {
    await this.approveTokenTransfer(tokenAmount);

    const response = await this.exchangeContract?.tokenToWeiSwap(tokenAmount, weiRequested, {
      value: weiRequested
    });
    await response.wait();
  }

  public async tokenToTokenSwap(fromAmount: number, toAmount: number, toTokenAddress: string) {
    await this.approveTokenTransfer(fromAmount);

    const response = await this.exchangeContract?.tokenToTokenSwap(
      fromAmount,
      toAmount,
      toTokenAddress
    );
    await response.wait();
  }

  private async approveTokenTransfer(amount: number) {
    const approveResponse = await this.tokenContract?.approve(
      CONTRACT_ADDRESSES.exchanges[this.tokenName],
      amount
    );

    await approveResponse.wait();
  }
}
