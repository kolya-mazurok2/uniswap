import { AppBar, Toolbar, Typography } from '@mui/material';
import { ConnectButton } from '../connect-button';
import { HeaderStyled } from './header.styled';

export const Header = () => (
  <HeaderStyled>
    <AppBar position="relative" className="nav-header">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          UNISWAP
        </Typography>

        <ConnectButton />
      </Toolbar>
    </AppBar>
  </HeaderStyled>
);
