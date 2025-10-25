/**
 * Landing Page - Project Demonstration Page
 */

import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
  const navigate = useNavigate();

  // NOTE: Automatic redirection has been removed.
  // The user must click the "Login" button manually and log in that way.

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">VIOLET</span>
          </div>

          <nav className="nav-menu">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="header-buttons">
            <button
              className="signup-btn"
              onClick={() => navigate('/login')}
            >
              Start for Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              ⚡ Secure on the Blockchain
            </div>
            <h1 className="hero-title">
              A single page
              <br />
              <span className="gradient-text">for all your links</span>
            </h1>
            <p className="hero-subtitle">
              Web3's first decentralized LinkTree. Your profile is secure on the blockchain, no company can delete or modify it.
            </p>
            <div className="hero-buttons">
              <button
                className="cta-button primary large"
                onClick={() => navigate('/login')}
              >
                Start for Free
              </button>
              <div className="trust-badge">
                <span className="trust-icon">✓</span>
                <span className="trust-text">Safe with Sui Blockchain</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="phone-mockup">
              <div className="phone-header">
                <div className="profile-avatar">J</div>
                <div className="profile-info">
                  <div className="profile-name">John Doe</div>
                  <div className="profile-username">@johndoe123</div>
                </div>
              </div>
              <div className="phone-links">
                <div className="mock-link">
                  <img className="link-icon" src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png'></img>
                  <span className="link-text">Instagram</span>
                </div>
                <div className="mock-link">
                  <img className="link-icon" src='https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png'></img>
                  <span className="link-text">YouTube</span>
                </div>
                <div className="mock-link">
                  <img className="link-icon" src='https://images.freeimages.com/image/large-previews/f35/x-twitter-logo-on-black-circle-5694247.png?h=350'></img>
                  <span className="link-text">X / Twitter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Violet?</h2>
          <p className="section-subtitle">
            Safer and more free than the classic LinkTree.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Completely Safe and Secure</h3>
            <p>Your profile is on the blockchain. No company can delete it.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Decentralized</h3>
            <p>Only you have access to your data.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Low Cost</h3>
            <p>Low, affordable prices. Super cheap!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Super Fast</h3>
            <p>Set up your profile in an instant.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Unlimited Links</h3>
            <p>Add as many links as you want.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Modern Design</h3>
            <p>Stand out with shiny neon effects.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-header">
          <h2 className="section-title">How Does It Work?</h2>
          <p className="section-subtitle">Start with 3 simple steps:</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Log in with Sui Wallet</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Set Up Your Profile</h3>
            <p>Fill in your details</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Add Links</h3>
            <p>Share your links with the world!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="cta-section">
        <div className="cta-box">
          <h2>Take Your Place on the Blockchain</h2>
          <p>Start for free, and only pay the minimal gas fee</p>
          <button
            className="cta-button primary large"
            onClick={() => navigate('/login')}
          >
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Powered by Sui Blockchain</p>
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
