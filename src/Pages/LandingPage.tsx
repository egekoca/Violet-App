/**
 * Landing Page - Project Presentation
 */

import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
import './LandingPage.css';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <img src="/violet2.png" alt="Violet" className="logo-image" />
            <span className="logo-text">VIOLET</span>
          </div>

          <nav className="nav-menu">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <button
              className="nav-link-btn"
              onClick={() => navigate('/leaderboard')}
            >
              Leaderboard
            </button>
          </nav>

          <div className="header-buttons">
            <button
              className="signup-btn"
              onClick={() => navigate('/login')}
            >
              Start For Free
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
              Web3's first decentralized LinkTree. Your profile is secure on the Blockchain, no company can delete or modify it.
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
                  <div className="social-icon instagram">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="link-text">Instagram</span>
                </div>
                <div className="mock-link">
                  <div className="social-icon youtube">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="link-text">YouTube</span>
                </div>
                <div className="mock-link">
                  <div className="social-icon twitter">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="link-text">X (Twitter)</span>
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
            <p>Low prices. Super cheap!</p>
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

      {/* User Journey Roadmap */}
      <section id="how-it-works" className="roadmap-section">
        <div className="section-header">
          <h2 className="section-title">Your Journey Starts Here</h2>
          <p className="section-subtitle">Follow this roadmap to create your perfect blockchain profile</p>
        </div>

        <div className="roadmap-timeline">
          <div className="roadmap-item completed">
            <div className="roadmap-phase">
              <div className="phase-number">1</div>
              <div className="phase-status completed">✓</div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 1</div>
              <h3>Connect Your Wallet</h3>
              <p>Connect your Sui wallet to get started. Your profile will be secured on the blockchain.</p>
              <div className="roadmap-features">
                <span className="feature-tag completed">✓ Wallet Connection</span>
                <span className="feature-tag completed">✓ Blockchain Security</span>
                <span className="feature-tag completed">✓ Instant Setup</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item current">
            <div className="roadmap-phase">
              <div className="phase-number">2</div>
              <div className="phase-status current">🚧</div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 2</div>
              <h3>Customize Your Profile</h3>
              <p>Add your personal information, bio, and profile picture. Make it uniquely yours.</p>
              <div className="roadmap-features">
                <span className="feature-tag current">🚧 Profile Setup</span>
                <span className="feature-tag current">🚧 Bio & Avatar</span>
                <span className="feature-tag current">🚧 Theme Selection</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item upcoming">
            <div className="roadmap-phase">
              <div className="phase-number">3</div>
              <div className="phase-status upcoming">⏳</div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 3</div>
              <h3>Add Your Links</h3>
              <p>Start adding your social media links, websites, and any other important links.</p>
              <div className="roadmap-features">
                <span className="feature-tag upcoming">⏳ Link Management</span>
                <span className="feature-tag upcoming">⏳ Social Integration</span>
                <span className="feature-tag upcoming">⏳ Custom Icons</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item future">
            <div className="roadmap-phase">
              <div className="phase-number">4</div>
              <div className="phase-status future">🔮</div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 4</div>
              <h3>Share & Grow</h3>
              <p>Share your profile link and watch your audience grow. Track analytics and optimize.</p>
              <div className="roadmap-features">
                <span className="feature-tag future">🔮 Analytics Dashboard</span>
                <span className="feature-tag future">🔮 Link Optimization</span>
                <span className="feature-tag future">🔮 Growth Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Coming Soon */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <div className="coming-soon-badge">🚀 Coming Soon</div>
          <h2 className="section-title">Premium Plans</h2>
          <p className="section-subtitle">
            Advanced features are coming soon. Get notified when we launch!
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card upcoming">
            <div className="plan-header">
              <h3 className="plan-name">Free</h3>
              <div className="plan-price">
                <span className="price-amount">$0</span>
                <span className="price-period">/month</span>
              </div>
              <p className="plan-description">Available now</p>
            </div>
            <ul className="plan-features">
              <li>✓ Up to 5 links</li>
              <li>✓ Basic profile customization</li>
              <li>✓ Blockchain security</li>
              <li>✓ Community support</li>
              <li>✓ Basic analytics</li>
            </ul>
            <button
              className="plan-button primary"
              onClick={() => navigate('/login')}
            >
              Get Started Free
            </button>
          </div>

          <div className="pricing-card upcoming featured">
            <div className="coming-soon-overlay">
              <div className="coming-soon-text">Coming Soon</div>
            </div>
            <div className="plan-header">
              <h3 className="plan-name">Plus</h3>
              <div className="plan-price">
                <span className="price-amount">$9</span>
                <span className="price-period">/month</span>
              </div>
              <p className="plan-description">For growing creators and businesses</p>
            </div>
            <ul className="plan-features">
              <li>✓ Unlimited links</li>
              <li>✓ Advanced customization</li>
              <li>✓ Custom domain support</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Social media integration</li>
              <li>✓ Custom themes</li>
            </ul>
            <button
              className="plan-button disabled"
              disabled
            >
              Coming Soon
            </button>
          </div>

          <div className="pricing-card upcoming">
            <div className="coming-soon-overlay">
              <div className="coming-soon-text">Coming Soon</div>
            </div>
            <div className="plan-header">
              <h3 className="plan-name">Enterprise</h3>
              <div className="plan-price">
                <span className="price-amount">$29</span>
                <span className="price-period">/month</span>
              </div>
              <p className="plan-description">For teams and organizations</p>
            </div>
            <ul className="plan-features">
              <li>✓ Everything in Plus</li>
              <li>✓ Team collaboration</li>
              <li>✓ White-label solution</li>
              <li>✓ API access</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
              <li>✓ Advanced security features</li>
            </ul>
            <button
              className="plan-button disabled"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
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

