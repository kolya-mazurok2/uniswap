import { Alert, Snackbar } from '@mui/material';
import { ToasterStyled } from './toaster.styled';
import { useAlertContext } from '../../../hooks/useAlertContext';

const Toaster = () => {
  const { severity, message, show, setShow } = useAlertContext();

  const handleClose = () => {
    setShow?.(false);
  };

  return (
    <ToasterStyled>
      <Snackbar open={show} onClick={handleClose} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
    </ToasterStyled>
  );
};

export default Toaster;
