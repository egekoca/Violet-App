/**
 * Login Page - Tam Ekran Giriş Sayfası
 * Linktree tarzı - Sol tarafta form, sağ tarafta görsel
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();

  // Cüzdan bağlandığında profil sayfasına yönlendir
  useEffect(() => {
    if (account) {
      navigate('/profile');
    }
  }, [account, navigate]);

  return (
    <div className="login-page">
      {/* Sol Taraf - Form */}
      <div className="login-left">
        <div className="login-container">
          {/* Logo */}
          <div className="login-logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🔗</span>
            <span className="logo-text">VIOLET</span>
          </div>

          {/* Başlık */}
          <div className="login-header">
            <h1>Hoş Geldin</h1>
            <p>Blockchain'deki profiline giriş yap</p>
          </div>

          {/* Connect Wallet */}
          <div className="wallet-connect-section">
            <ConnectButton />
          </div>

          {/* Bilgilendirme */}
          <div className="login-info">
            <div className="info-card">
              <div className="info-icon">🔐</div>
              <div className="info-content">
                <h3>Güvenli Giriş</h3>
                <p>Sui Wallet ile güvenli bir şekilde giriş yapın</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">⚡</div>
              <div className="info-content">
                <h3>Hızlı Erişim</h3>
                <p>Bir tıkla profilinize ulaşın</p>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="login-footer">
            <p>
              Henüz hesabın yok mu?{' '}
              <button 
                className="signup-link"
                onClick={() => navigate('/')}
              >
                Ücretsiz Başla
              </button>
            </p>
            <div className="wallet-download">
              Cüzdanın yok mu?{' '}
              <a 
                href="https://chrome.google.com/webstore/detail/sui-wallet" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Sui Wallet İndir →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Görsel */}
      <div className="login-right">
        <div className="login-visual">
          {/* Decorative Elements */}
          <div className="visual-bg">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>

          {/* Featured Profile Cards */}
          <div className="featured-profiles">
            <div className="profile-card card-1">
              <div className="card-avatar">🎨</div>
              <div className="card-info">
                <div className="card-name">Creator</div>
                <div className="card-links">15 links</div>
              </div>
            </div>

            <div className="profile-card card-2">
              <div className="card-avatar">🎵</div>
              <div className="card-info">
                <div className="card-name">Musician</div>
                <div className="card-links">8 links</div>
              </div>
            </div>

            <div className="profile-card card-3">
              <div className="card-avatar">💼</div>
              <div className="card-info">
                <div className="card-name">Business</div>
                <div className="card-links">12 links</div>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="visual-content">
            <h2>Blockchain'de Güvenle</h2>
            <p>Profiliniz sonsuza dek sizin</p>
            <div className="visual-badge">
              <span className="badge-icon">⚡</span>
              <span>Powered by Sui</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

