import { Card, CardContent, Typography } from '@mui/material';
import { BigNumber } from 'ethers';
import { ExchangeInfoStyled } from './exchange-info.styled';

interface IProps {
  name: string;
  symbol: string;
  totalSupply: BigNumber;
  price: BigNumber;
}

export const ExchangeInfo = ({ name, symbol, totalSupply, price }: IProps) => {
  return (
    <ExchangeInfoStyled>
      <Card>
        <CardContent>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="body1">
            Total: {totalSupply.toNumber()} {symbol}
          </Typography>
          {price.toNumber() > 0 ? (
            <Typography variant="body1">
              Current price: {price.toNumber()} WEI per {symbol}
            </Typography>
          ) : (
            <Typography variant="body1">Token has no liquidity yet</Typography>
          )}
        </CardContent>
      </Card>
    </ExchangeInfoStyled>
  );
};
