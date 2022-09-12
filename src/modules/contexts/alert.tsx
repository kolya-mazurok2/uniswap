import { createContext, FC, ReactNode, useMemo, useState } from 'react';

export type Severity = 'error' | 'success';

interface IState {
  severity: Severity;
  message: string;
  show: boolean;
  setSeverity?: (severity: Severity) => void;
  setMessage?: (message: string) => void;
  setShow?: (show: boolean) => void;
  showAlert?: (severity: Severity, message: string) => void;
}

const INITIAL_STATE: IState = {
  severity: 'error',
  message: 'Something went wrong!',
  show: false
};

const AlertContext = createContext<IState>(INITIAL_STATE);

interface Props {
  children: ReactNode;
}

const AlertProvider: FC<Props> = ({ children }: Props) => {
  const [severity, setSeverity] = useState(INITIAL_STATE.severity);
  const [message, setMessage] = useState(INITIAL_STATE.message);
  const [show, setShow] = useState(INITIAL_STATE.show);

  const showAlert = (severity: Severity, message: string) => {
    setSeverity(severity);
    setMessage(message);
    setShow(true);
  };

  const value = useMemo(
    () => ({
      severity,
      message,
      show,
      setSeverity,
      setMessage,
      setShow,
      showAlert
    }),
    [severity, message, show]
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export default AlertProvider;

export { AlertContext };
