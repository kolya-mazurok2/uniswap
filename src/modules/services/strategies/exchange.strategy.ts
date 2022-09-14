import { IExchangeStrategy } from '.';
import { TokenWithWei } from '../../types';
import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { ExchangeService } from '../exchange.service';

export abstract class ExchangeStrategy implements IExchangeStrategy {
  protected exchangeService?: ExchangeService;
  protected fromToken?: TokenWithWei;
  protected toToken?: TokenWithWei;

  protected abstract getExchangeService(
    fromToken: TokenWithWei,
    toToken: TokenWithWei
  ): Promise<ExchangeService>;

  protected abstract swap(from: number, to: number): Promise<void>;

  protected abstract getAmount(inputValue: number): Promise<BigNumber>;

  protected abstract getPriceImpact(inputValue: number): Promise<number>;

  public async initialize(fromToken: TokenWithWei, toToken: TokenWithWei, signer?: JsonRpcSigner) {
    this.exchangeService = await this.getExchangeService(fromToken, toToken);
    this.exchangeService.connect(signer!);
  }

  public async executeSwap(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    toAmount: number,
    signer: JsonRpcSigner
  ) {
    await this.initialize(fromToken, toToken, signer);
    return this.swap(toAmount, fromAmount);
  }

  public async executeGetAmount(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer?: JsonRpcSigner
  ) {
    await this.initialize(fromToken, toToken, signer);
    return this.getAmount(fromAmount);
  }

  public async executeGetPriceImpact(
    fromToken: TokenWithWei,
    toToken: TokenWithWei,
    fromAmount: number,
    signer?: JsonRpcSigner
  ) {
    await this.initialize(fromToken, toToken, signer);
    return this.getPriceImpact(fromAmount);
  }
}
