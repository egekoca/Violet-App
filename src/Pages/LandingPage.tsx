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
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
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
            <h1 className="hero-title">
              Your Link-in-Bio
              <br />
              <span className="gradient-text">Reimagined</span>
            </h1>
            <p className="hero-subtitle">
              Create a stunning, branded link in bio that brings your content, products, and business tools together on the blockchain.
            </p>
            <div className="hero-actions">
              <button
                className="cta-button primary large"
                onClick={() => navigate('/login')}
              >
                Start For Free
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="status-bar">
                  <div className="status-left">
                    <span className="time">9:41</span>
                  </div>
                  <div className="status-right">
                    <div className="signal-bars">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                    <div className="wifi-icon">📶</div>
                    <div className="battery">🔋</div>
                  </div>
                </div>
                <div className="profile-header">
                  <div className="profile-avatar">
                    <img src="/violet2.png" alt="Violet" className="avatar-image" />
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">VioletUser</div>
                    <div className="profile-bio">Sui x Walrus</div>
                    <div className="profile-username">@vio</div>
                  </div>
                </div>
                
                <div className="xp-badge">
                  <span className="xp-icon">⭐</span>
                  <span className="xp-text">99 XP</span>
                </div>
                
                <div className="action-buttons">
                  <button className="action-btn nft-btn">
                    <span className="btn-icon">⚏</span>
                    <span className="btn-text">NFT Collection</span>
                  </button>
                  <button className="action-btn tip-btn">
                    <span className="btn-icon">✈</span>
                    <span className="btn-text">Send Tip</span>
                  </button>
                </div>
                
                <div className="social-links">
                  <div className="social-link">
                    <div className="social-logo instagram">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="link-text">Instagram</span>
                    <span className="link-arrow">→</span>
                    <span className="link-icon">⚏</span>
                  </div>
                  <div className="social-link">
                    <div className="social-logo linkedin">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="link-text">LinkedIn</span>
                    <span className="link-arrow">→</span>
                    <span className="link-icon">⚏</span>
                  </div>
                  <div className="social-link">
                    <div className="social-logo youtube">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="link-text">YouTube</span>
                    <span className="link-arrow">→</span>
                    <span className="link-icon">⚏</span>
                  </div>
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
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C12 22 20 18 20 12V7L12 2L4 7V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Completely Safe and Secure</h3>
            <p>Your profile is on the blockchain. No company can delete it.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Decentralized</h3>
            <p>Only you have access to your data.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Low Cost</h3>
            <p>Low prices. Super cheap!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Super Fast</h3>
            <p>Set up your profile in an instant.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M10 13C13.866 13 17 16.134 17 20M10 13C6.13401 13 3 16.134 3 20M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Unlimited Links</h3>
            <p>Add as many links as you want.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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
              <div className="phase-status completed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 1</div>
              <h3>Connect Your Wallet</h3>
              <p>Connect your Sui wallet to get started. Your profile will be secured on the blockchain.</p>
              <div className="roadmap-features">
                <span className="feature-tag completed">Wallet Connection</span>
                <span className="feature-tag completed">Blockchain Security</span>
                <span className="feature-tag completed">Instant Setup</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item current">
            <div className="roadmap-phase">
              <div className="phase-number">2</div>
              <div className="phase-status current">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 2</div>
              <h3>Customize Your Profile</h3>
              <p>Add your personal information, bio, and profile picture. Make it uniquely yours.</p>
              <div className="roadmap-features">
                <span className="feature-tag current">Profile Setup</span>
                <span className="feature-tag current">Bio & Avatar</span>
                <span className="feature-tag current">Theme Selection</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item upcoming">
            <div className="roadmap-phase">
              <div className="phase-number">3</div>
              <div className="phase-status upcoming">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 3</div>
              <h3>Add Your Links</h3>
              <p>Start adding your social media links, websites, and any other important links.</p>
              <div className="roadmap-features">
                <span className="feature-tag upcoming">Link Management</span>
                <span className="feature-tag upcoming">Social Integration</span>
                <span className="feature-tag upcoming">Custom Icons</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item future">
            <div className="roadmap-phase">
              <div className="phase-number">4</div>
              <div className="phase-status future">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9.663 17H4.337C3.186 17 2.5 15.5 3.5 14.5L8.5 9.5C9.5 8.5 11 8.5 12 9.5L16.5 14C17.5 15 16.814 16.5 15.663 16.5H10.337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-date">Step 4</div>
              <h3>Share & Grow</h3>
              <p>Share your profile link and watch your audience grow. Track analytics and optimize.</p>
              <div className="roadmap-features">
                <span className="feature-tag future">Analytics Dashboard</span>
                <span className="feature-tag future">Link Optimization</span>
                <span className="feature-tag future">Growth Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* XP & Leaderboard Section */}
      <section className="xp-leaderboard-section">
        <div className="section-header">
          <h2 className="section-title">XP & Leaderboard</h2>
          <p className="section-subtitle">
            Earn XP points and climb the leaderboard to showcase your achievements
          </p>
        </div>

        <div className="xp-leaderboard-grid">
          <div className="xp-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#ffd700"/>
              </svg>
            </div>
            <h3 className="card-title">How to Earn XP</h3>
            <ul className="card-features">
              <li>• Create your profile (+10 XP)</li>
              <li>• Add social links (+5 XP each)</li>
              <li>• Receive tips (+2 XP per tip)</li>
              <li>• Daily visits (+1 XP per day)</li>
              <li>• Complete profile (+15 XP)</li>
            </ul>
          </div>

          <div className="leaderboard-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#ffd700"/>
                <path d="M9 8H15V10H9V8ZM9 12H15V14H9V12ZM9 16H13V18H9V16Z" fill="#ffd700"/>
              </svg>
            </div>
            <h3 className="card-title">Leaderboard Rankings</h3>
            <ul className="card-features">
              <li>• Top 10 users displayed</li>
              <li>• Real-time updates</li>
              <li>• Weekly resets</li>
              <li>• Special badges for top 3</li>
              <li>• Community recognition</li>
            </ul>
          </div>
        </div>

        <div className="xp-leaderboard-cta">
          <button
            className="cta-button primary large"
            onClick={() => navigate('/leaderboard')}
          >
            View Leaderboard
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">PRICE PLAN$</h2>
          <p className="section-subtitle">
            Choose what suits you best. Change it any time.
          </p>
        </div>

        <div className="pricing-grid">
          {/* FREE PLAN */}
          <div className="pricing-card free-plan">
            <div className="plan-header">
              <h3 className="plan-name">FREE PLAN</h3>
              <div className="plan-price">
                <span className="price-amount">0.00$</span>
              </div>
            </div>
            <ul className="plan-features">
              <li>• 3 links</li>
              <li>• 1 wallet profile</li>
              <li>• Basic analytics (total clicks only)</li>
              <li>• Stored on Walrus free tier</li>
            </ul>
            <button
              className="plan-button primary"
              onClick={() => navigate('/login')}
            >
              Get Started Free
            </button>
          </div>

          {/* PLUS PLAN */}
          <div className="pricing-card plus-plan upcoming">
            <div className="coming-soon-overlay">
              <div className="coming-soon-text">Upcoming</div>
            </div>
            <div className="plan-header">
              <h3 className="plan-name">PLUS PLAN</h3>
              <div className="plan-price">
                <span className="price-amount">19.99$</span>
              </div>
            </div>
            <ul className="plan-features">
              <li>• 6 links</li>
              <li>• 2 wallet profiles</li>
              <li>• Advanced analytics</li>
              <li>• Custom themes & colors</li>
              <li>• Priority support</li>
            </ul>
            <button
              className="plan-button disabled"
              disabled
            >
              Coming Soon
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="pricing-card pro-plan featured upcoming">
            <div className="coming-soon-overlay">
              <div className="coming-soon-text">Upcoming</div>
            </div>
            <div className="plan-header">
              <h3 className="plan-name">Pro plan</h3>
              <div className="plan-price">
                <span className="price-amount">29.99$</span>
              </div>
            </div>
            <ul className="plan-features">
              <li>• 9 links</li>
              <li>• Up to 4 wallet profiles</li>
              <li>• Full analytics dashboard</li>
              <li>• On-chain NFT badge verification</li>
              <li>• Early access to DAO governance</li>
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

