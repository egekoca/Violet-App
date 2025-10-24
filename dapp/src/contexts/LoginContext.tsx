import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface LoginContextType {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  isConnected: boolean;
  userAddress: string | null;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const currentAccount = useCurrentAccount();

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const isConnected = !!currentAccount;
  const userAddress = currentAccount?.address || null;

  const value: LoginContextType = {
    isLoginOpen,
    openLogin,
    closeLogin,
    isConnected,
    userAddress,
  };

  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  );
};
