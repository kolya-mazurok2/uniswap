import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'normalize.css';
import { SignerProvider } from './modules/contexts/signer';
import AlertProvider from './modules/contexts/alert';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <AlertProvider>
      <SignerProvider>
        <App />
      </SignerProvider>
    </AlertProvider>
  </StrictMode>
);
