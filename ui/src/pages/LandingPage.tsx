/**
 * Landing Page - Proje Tanıtım Sayfası
 * İlk açılışta gösterilen ana sayfa
 */

import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
  const navigate = useNavigate();

  // NOT: Otomatik redirect kaldırıldı.
  // Kullanıcı manuel olarak "Giriş Yap" butonuna tıklayarak login sayfasına gitmeli.

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🔗</span>
            <span className="logo-text">VIOLET</span>
          </div>
          
          <nav className="nav-menu">
            <a href="#features">Özellikler</a>
            <a href="#how-it-works">Nasıl Çalışır</a>
            <a href="#pricing">Fiyatlandırma</a>
          </nav>

          <div className="header-buttons">
            <button 
              className="login-btn-text"
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </button>
            <button 
              className="signup-btn"
              onClick={() => navigate('/login')}
            >
              Ücretsiz Başla
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              ⚡ Blockchain üzerinde güvenli
            </div>
            <h1 className="hero-title">
              Tüm linkleriniz için
              <br />
              <span className="gradient-text">tek bir link</span>
            </h1>
            <p className="hero-subtitle">
              Web3'ün ilk merkeziyetsiz LinkTree'si. Profiliniz blockchain'de güvende, 
              hiçbir şirket silemez veya değiştiremez.
            </p>
            <div className="hero-buttons">
              <button 
                className="cta-button primary large"
                onClick={() => navigate('/login')}
              >
                Ücretsiz Başla
              </button>
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span className="trust-text">Sui Blockchain ile güvende</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="phone-mockup">
              <div className="phone-header">
                <div className="profile-avatar">V</div>
                <div className="profile-info">
                  <div className="profile-name">Ahmet Yılmaz</div>
                  <div className="profile-username">@ahmet123</div>
                </div>
              </div>
              <div className="phone-links">
                <div className="mock-link">
                  <span className="link-icon">📸</span>
                  <span className="link-text">Instagram</span>
                </div>
                <div className="mock-link">
                  <span className="link-icon">▶️</span>
                  <span className="link-text">YouTube</span>
                </div>
                <div className="mock-link">
                  <span className="link-icon">🐦</span>
                  <span className="link-text">Twitter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Neden Violet?</h2>
          <p className="section-subtitle">
            Klasik LinkTree'den daha güvenli, daha özgür
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Tamamen Güvenli</h3>
            <p>Profiliniz blockchain'de. Hiçbir şirket silemez.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Merkeziyetsiz</h3>
            <p>Verilerinize sadece siz sahipsiniz.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Düşük Maliyet</h3>
            <p>Minimal ücretler. Çok ucuz!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Süper Hızlı</h3>
            <p>Anında profil oluşturun.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Sınırsız Link</h3>
            <p>İstediğiniz kadar link ekleyin.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Modern Tasarım</h3>
            <p>Neon efektleriyle öne çıkın.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-header">
          <h2 className="section-title">Nasıl Çalışır?</h2>
          <p className="section-subtitle">3 basit adımda başlayın</p>
        </div>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Cüzdanı Bağla</h3>
            <p>Sui Wallet ile giriş yap</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Profil Oluştur</h3>
            <p>Bilgilerini doldur</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Link Ekle</h3>
            <p>Linklerini paylaş!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="cta-section">
        <div className="cta-box">
          <h2>Blockchain'deki yerinizi alın</h2>
          <p>Ücretsiz başlayın, sadece minimal gas fee ödeyin</p>
          <button 
            className="cta-button primary large"
            onClick={() => navigate('/login')}
          >
            Hemen Başla
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Powered by Sui Blockchain ⚡</p>
        <div className="footer-links">
          <a href="https://sui.io" target="_blank" rel="noopener noreferrer">Sui</a>
          <span>•</span>
          <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer">Docs</a>
          <span>•</span>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

