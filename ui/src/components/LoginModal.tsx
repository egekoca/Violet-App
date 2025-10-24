/**
 * Login Modal - Cüzdan Bağlantı Modal'ı
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
          <h2>🔐 Giriş Yap</h2>
          <p>Violet'e hoş geldin! Başlamak için cüzdanını bağla.</p>
        </div>

        <div className="modal-body">
          <div className="wallet-info-box">
            <div className="info-icon">🎯</div>
            <h3>Neden Cüzdan Gerekli?</h3>
            <ul>
              <li>✅ Profilin blockchain'de güvende</li>
              <li>✅ Tamamen merkeziyetsiz</li>
              <li>✅ Verilerine sadece sen sahipsin</li>
              <li>✅ Hiçbir şirket profilini silemez</li>
            </ul>
          </div>

          <div className="connect-wallet-container">
            <ConnectButton />
          </div>

          <div className="modal-footer">
            <p>Cüzdanın yok mu?</p>
            <a 
              href="https://chrome.google.com/webstore/detail/sui-wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-wallet-link"
            >
              Sui Wallet İndir →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

