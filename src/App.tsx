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
import { CONTRACT_ADDRESSES } from './modules/common/consts/app-keys.const';
import useSigner from './modules/contexts/signer';
import exchangeFactory from './modules/factories/exchange.factory';
import { useAlertContext } from './modules/hooks/useAlertContext';
import { primaryTokenService, secondaryTokenService } from './modules/services/erc20-token.service';
import { IERC20Token, Token, TOKENS, TOKENS_WITH_ETH } from './modules/types';
import { getSolidityErrorMessage } from './modules/utils';

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
      if (fromToken === 'Wei') {
        const exchangeService = exchangeFactory.getService(toToken as Token);
        exchangeService.connect(signer!);
        await exchangeService.weiToTokenSwap(toAmount, fromAmount);
      } else if (toToken === 'Wei') {
        const exchangeService = exchangeFactory.getService(fromToken as Token);
        exchangeService.connect(signer!);
        await exchangeService.tokenToWeiSwap(fromAmount, toAmount);
      } else {
        const exchangeService = exchangeFactory.getService(fromToken as Token);
        exchangeService.connect(signer!);
        await exchangeService.tokenToTokenSwap(
          fromAmount,
          toAmount,
          CONTRACT_ADDRESSES.tokens[toToken]
        );
      }

      showAlert?.('success', DEFAULT_TRANSACTION_SUCCESS);
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
