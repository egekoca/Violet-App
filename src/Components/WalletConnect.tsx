/**
 * Wallet Connect Component
 * For connecting to a Sui wallet and displaying Wallet information
 */

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import './WalletConnect.css';
import { useState } from 'react';

export function WalletConnect() {
  const account = useCurrentAccount();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    });
  };

  return (
    <div className="wallet-connect">
      <ConnectButton />
      
      {account && (
        <div className="wallet-info">
          <div className="wallet-address-container">
            <span className="wallet-address">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
            <button
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy address'}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

