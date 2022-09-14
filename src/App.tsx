import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { AppStyled } from './App.styled';
import { Header } from './modules/common/components/header';
import {
  IFormValues as ILiquidityFormValues,
  LiquidityForm
} from './modules/common/components/liquidity-form/liquidity-form.component';
import { IFormValues as ISwapFormValues, SwapForm } from './modules/common/components/swap-form';
import Toaster from './modules/common/components/toaster/toaster.component';
import { ExchangeInfo } from './modules/common/components/exchange-info/exchange-info.component';
import { DEFAULT_ERROR, DEFAULT_TRANSACTION_SUCCESS } from './modules/common/consts';
import useSigner from './modules/contexts/signer';
import exchangeFactory from './modules/services/factories/exchange.factory';
import { useAlertContext } from './modules/hooks/useAlertContext';
import {
  primaryExchangeInfoService,
  secondaryExchangeInfoService
} from './modules/services/exchange-info.service';
import { IExchange, TOKENS, TOKENS_WITH_ETH, TokenWithWei } from './modules/types';
import { getSolidityErrorMessage } from './modules/utils';
import { ExchangeContext } from './modules/services/contexts/exchange.context';
import {
  ExchangeTokenToTokenStrategy,
  ExchangeTokenToWeiStrategy,
  ExchangeWeiToTokenStrategy
} from './modules/services/strategies';

const App = () => {
  const { showAlert } = useAlertContext();
  const { signer } = useSigner();

  const [primaryToken, setPrimaryToken] = useState<IExchange | undefined>();
  const [secondaryToken, setSecondaryToken] = useState<IExchange | undefined>();

  const [swapContext] = useState(new ExchangeContext());
  const [swapToAmount, setSwapToAmount] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);

  const handleLiquidityAdded = async ({ amount, price, token }: ILiquidityFormValues) => {
    const exchangeService = exchangeFactory.getService(token);
    exchangeService.connect(signer!);

    try {
      await exchangeService.addLiquidity(amount, price);
      showAlert?.('success', DEFAULT_TRANSACTION_SUCCESS);
    } catch (error) {
      const message = getSolidityErrorMessage(error as Error);
      showAlert?.('error', message);
    }
  };

  const handleExchangeValues = (fromToken: TokenWithWei, toToken: TokenWithWei) => {
    if (fromToken === 'Wei') {
      swapContext.setStrategy(new ExchangeWeiToTokenStrategy());
    }

    if (toToken === 'Wei') {
      swapContext.setStrategy(new ExchangeTokenToWeiStrategy());
    }

    if (fromToken !== 'Wei' && toToken !== 'Wei') {
      swapContext.setStrategy(new ExchangeTokenToTokenStrategy());
    }
  };

  const handleSwap = async ({ fromToken, toToken, fromAmount, toAmount }: ISwapFormValues) => {
    if (fromToken === toToken) {
      return showAlert?.('error', DEFAULT_ERROR);
    }

    try {
      await swapContext.swap(fromToken, toToken, fromAmount, toAmount, signer!);
      showAlert?.('success', DEFAULT_TRANSACTION_SUCCESS);
    } catch (error) {
      const message = getSolidityErrorMessage(error as Error);
      showAlert?.('error', message);
    }
  };

  const handleSwapFromAmount = async ({ fromToken, toToken, fromAmount }: ISwapFormValues) => {
    const newToAmount = await swapContext.getAmount(fromToken, toToken, fromAmount, signer!);
    setSwapToAmount(newToAmount ? newToAmount.toNumber() : 0);

    const newPriceImpact = await swapContext.getPriceImpact(
      fromToken,
      toToken,
      fromAmount,
      signer!
    );

    setPriceImpact(parseFloat((newPriceImpact! * 100).toFixed(3)));
  };

  useEffect(() => {
    (async () => {
      const primaryToken = await primaryExchangeInfoService.getToken();
      setPrimaryToken(primaryToken);

      const secondaryToken = await secondaryExchangeInfoService.getToken();
      setSecondaryToken(secondaryToken);
    })();
  }, []);

  return (
    <AppStyled>
      <Header />

      <Box className="main">
        <Container>
          <Box className="section">
            <Typography variant="h2">Tokens info</Typography>

            {primaryToken && (
              <ExchangeInfo
                name={primaryToken.name}
                symbol={primaryToken.symbol}
                totalSupply={primaryToken.reserve}
                price={primaryToken.price}
              />
            )}

            {secondaryToken && (
              <ExchangeInfo
                name={secondaryToken.name}
                symbol={secondaryToken.symbol}
                totalSupply={secondaryToken.reserve}
                price={secondaryToken.price}
              />
            )}
          </Box>

          {signer && (
            <>
              <Box className="section">
                <Typography variant="h2">Add Liquidity</Typography>

                <LiquidityForm onSubmit={handleLiquidityAdded} tokens={TOKENS} />
              </Box>

              <Box className="section">
                <Typography variant="h2">Swap</Typography>

                <Typography variant="h4">
                  Price Impact: ~{priceImpact ? priceImpact : 0.001} %
                </Typography>

                <SwapForm
                  onSubmit={handleSwap}
                  onFromAmountChange={handleSwapFromAmount}
                  onExchangeValuesChange={handleExchangeValues}
                  tokens={TOKENS_WITH_ETH}
                  inputData={{ toAmount: swapToAmount }}
                />
              </Box>
            </>
          )}
        </Container>
      </Box>

      <Toaster />
    </AppStyled>
  );
};

export default App;
