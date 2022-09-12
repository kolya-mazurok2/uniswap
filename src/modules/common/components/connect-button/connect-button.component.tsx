import { Button, Typography } from '@mui/material';
import useSigner from '../../../contexts/signer';
import { ConnectButtonStyled } from './connect-button.styled';

export const ConnectButton = () => {
  const { address, loading, connect } = useSigner();

  return (
    <ConnectButtonStyled>
      {address ? (
        <Typography variant="body1">{address.substring(0, 5)}...</Typography>
      ) : (
        <Button variant="outlined" color="success" onClick={connect} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect'}
        </Button>
      )}
    </ConnectButtonStyled>
  );
};
