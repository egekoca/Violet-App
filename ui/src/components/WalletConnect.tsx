/**
 * Wallet Connect Component
 * For connecting to a Sui wallet and displaying Wallet information
 */

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import './WalletConnect.css';

export function WalletConnect() {
  const account = useCurrentAccount();

  return (
    <div className="wallet-connect">
      <ConnectButton />
      
      {account && (
        <div className="wallet-info">
          <span className="wallet-label">Connected:</span>
          <span className="wallet-address">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}

