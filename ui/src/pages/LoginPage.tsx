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

  // Cüzdan bağlandığında admin paneline yönlendir
  // Admin paneli profil kontrolü yapıp gerekli sayfayı gösterecek
  useEffect(() => {
    if (account) {
      navigate('/admin');
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
            <h1>Welcome</h1>
            <p>Log in to your Blockchain account</p>
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
                <h3>Secure Login</h3>
                <p>Log in securely with Sui Wallet</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">⚡</div>
              <div className="info-content">
                <h3>Fast Access</h3>
                <p>Reach to your profile within a single click</p>
              </div>
            </div>
          </div>

          {/* Alt Bilgi */}
          <div className="login-footer">
            {/* <p>
              Don't have an account yet?{' '}
              <button 
                className="signup-link"
                onClick={() => navigate('/')}
              >
                Start For Free
              </button>
            </p> */}
            <div className="wallet-download">
              <p>Don't have a wallet yet? <a 
                href="https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" target="_blank" rel="noopener noreferrer"> Download Sui Wallet → </a></p> 
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
            <h2>Safe With Blockchain</h2>
            <p>Your profile is forever yours</p>
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

