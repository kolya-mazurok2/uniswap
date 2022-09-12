import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { createContext, ReactNode, useContext, useState } from 'react';
import Web3Modal from 'web3modal';

export type SignerContextType = {
  signer?: JsonRpcSigner;
  address?: string;
  loading: boolean;
  connect: () => Promise<void>;
};

const SignerContext = createContext<SignerContextType>({} as any);

const useSigner = () => useContext(SignerContext);

export const SignerProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const connect = async () => {
    try {
      const web3modal = new Web3Modal();
      const instance = await web3modal.connect();
      const provider = new Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <SignerContext.Provider value={{ signer, address, loading, connect }}>
      {children}
    </SignerContext.Provider>
  );
};

export default useSigner;
