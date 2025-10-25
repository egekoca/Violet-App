/**
 * Wallet Connection Module
 * Connect to a Sui wallet and display it
 */

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import './WalletConnect.css';
import { useState } from 'react';

export function WalletConnect() {
  const account = useCurrentAccount();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after animation
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  return (
    <div className="wallet-connect">
      <ConnectButton />
      
      {account && (
        <div className="wallet-info">
          <span className="wallet-label">Connected:</span>
          <span className="wallet-address">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
          <button
            className={`copy-btn ${copied ? "copied" : ""}`}
            onClick={copyToClipboard}
          >
            {copied ? "✅" : "📄"}
          </button>
        </div>
      )}
    </div>
  );
}

