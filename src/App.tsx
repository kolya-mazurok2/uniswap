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
import { TokenERC20Info } from './modules/common/components/token-erc20-info/token-erc20-info.component';
import { DEFAULT_ERROR, DEFAULT_TRANSACTION_SUCCESS } from './modules/common/consts';
import useSigner from './modules/contexts/signer';
import exchangeFactory from './modules/services/factories/exchange.factory';
import { useAlertContext } from './modules/hooks/useAlertContext';
import { primaryTokenService, secondaryTokenService } from './modules/services/erc20-token.service';
import { IERC20Token, TOKENS, TOKENS_WITH_ETH } from './modules/types';
import { getSolidityErrorMessage } from './modules/utils';
import { ExchangeContext } from './modules/services/contexts/exchange.context';
import {
  ExchangeTokenToTokenStrategy,
  ExchangeWeiToTokenStrategy
} from './modules/services/strategies';

const App = () => {
  const { showAlert } = useAlertContext();
  const { signer } = useSigner();

  const [primaryToken, setPrimaryToken] = useState<IERC20Token | undefined>();
  const [secondaryToken, setSecondaryToken] = useState<IERC20Token | undefined>();

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

  const handleSwap = async ({ fromToken, toToken, fromAmount, toAmount }: ISwapFormValues) => {
    if (fromToken === toToken) {
      return showAlert?.('error', DEFAULT_ERROR);
    }

    try {
      const context = new ExchangeContext();

      if (fromToken === 'Wei') {
        context.setStrategy(new ExchangeWeiToTokenStrategy());
      }

      if (toToken === 'Wei') {
        context.setStrategy(new ExchangeWeiToTokenStrategy());
      }

      if (fromToken !== 'Wei' && toToken !== 'Wei') {
        context.setStrategy(new ExchangeTokenToTokenStrategy());
      }

      context.executeStrategy(fromToken, toToken, fromAmount, toAmount, signer);
    } catch (error) {
      const message = getSolidityErrorMessage(error as Error);
      showAlert?.('error', message);
    }
  };

  useEffect(() => {
    (async () => {
      const primaryToken = await primaryTokenService.getToken();
      setPrimaryToken(primaryToken);

      const secondaryToken = await secondaryTokenService.getToken();
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
              <TokenERC20Info
                name={primaryToken.name}
                symbol={primaryToken.symbol}
                totalSupply={primaryToken.totalSupply}
                price={primaryToken.price}
              />
            )}

            {secondaryToken && (
              <TokenERC20Info
                name={secondaryToken.name}
                symbol={secondaryToken.symbol}
                totalSupply={secondaryToken.totalSupply}
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

                <SwapForm onSubmit={handleSwap} tokens={TOKENS_WITH_ETH} />
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
