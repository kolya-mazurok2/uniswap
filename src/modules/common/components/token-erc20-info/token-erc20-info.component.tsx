import { Card, CardContent, Typography } from '@mui/material';
import { BigNumber } from 'ethers';
import { TokenERC20InfoStyled } from './token-erc20-info.styled';

interface IProps {
  name: string;
  symbol: string;
  totalSupply: BigNumber;
  price: BigNumber;
}

export const TokenERC20Info = ({ name, symbol, totalSupply, price }: IProps) => {
  return (
    <TokenERC20InfoStyled>
      <Card>
        <CardContent>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="body1">Total: {totalSupply.toNumber()} WEI</Typography>
          {price.toNumber() > 0 ? (
            <Typography variant="body1">
              Current price: {price.toNumber()} WEI per {symbol}
            </Typography>
          ) : (
            <Typography variant="body1">Token has no liquidity yet</Typography>
          )}
        </CardContent>
      </Card>
    </TokenERC20InfoStyled>
  );
};
