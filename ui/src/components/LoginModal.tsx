/**
 * Login Component For Wallet Connection
 * To add a "Connect Wallet" button and UI to the screen
 * Ekranın ortasında büyük Connect Wallet butonu
 */

import { ConnectButton } from '@mysten/dapp-kit';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-header">
          <h2>Log In</h2>
          <p>Welcome to Violet! Connect to your wallet to start.</p>
        </div>

        <div className="modal-body">
          <div className="wallet-info-box">
            <div className="info-icon">🎯</div>
            <h3>Why Is A Wallet Required?</h3>
            <ul>
              <li>✅ Your profile is safe on the blockchain</li>
              <li>✅ Completely decentralized</li>
              <li>✅ Only you have access to your data</li>
              <li>✅ No company can delete them</li>
            </ul>
          </div>

          <div className="connect-wallet-container">
            <ConnectButton />
          </div>

          <div className="modal-footer">
            <p>Don't have a wallet?</p>
            <a 
              href="https://chrome.google.com/webstore/detail/sui-wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-wallet-link"
            >
              Download Sui Wallet →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

