import { useContext } from 'react';
import { AlertContext } from '../contexts/alert';

export const useAlertContext = () => {
  const { severity, setSeverity, message, setMessage, show, setShow, showAlert } =
    useContext(AlertContext);

  return { severity, setSeverity, message, setMessage, show, setShow, showAlert };
};
