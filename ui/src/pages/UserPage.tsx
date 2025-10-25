import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getUserProfile, getUserProfiles } from '../lib/blockchain';
import { UserProfile } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import './UserPage.css';

export function UserPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [account]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Eğer cüzdan bağlı değilse
      if (!account) {
        setError('Lütfen cüzdanınızı bağlayın');
        setProfile(null);
        return;
      }

      // Kullanıcının tüm profillerini çek
      const profiles = await getUserProfiles(account.address);
      
      if (profiles.length === 0) {
        // Profil yoksa hata mesajı göster (otomatik yönlendirme yok)
        setError('Henüz profilin yok. Hemen oluştur!');
        setProfile(null);
      } else {
        // İlk profili göster (çoklu profil desteği ileride eklenebilir)
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setError('Profil yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="user-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="user-page error">
        <div className="container">
          <h2>🔐 Wallet Connection Is Required</h2>
          <p style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.8)' }}>
            Connect to your wallet to be able to see your profile.
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-page error">
        <div className="container">
          <h2>⚠️ {error}</h2>
          {error.includes('profilin yok') && (
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🎨 Create A Profile
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Back To Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-page error">
        <div className="container">
          <h2>No Profile</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '24px',
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Back To Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="container">
        {/* Wallet Connection */}
        <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
          <WalletConnect />
        </div>

        {/* Admin Button */}
        <button 
          className="admin-btn"
          onClick={() => navigate('/admin')}
          title="Admin Paneli"
        >
          ⚙️
        </button>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="avatar-placeholder">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="display-name">{profile.display_name}</h1>
          <p className="bio">{profile.bio}</p>
          <p className="username-label">@{profile.username}</p>
        </div>

        {/* Links Section */}
        <div className="links-section">
          {profile.links.length === 0 ? (
            <p className="no-links">No links have been added yet</p>
          ) : (
            profile.links
              .filter(link => link.is_active)
              .map((link, index) => (
                <button
                  key={index}
                  className="link-card"
                  onClick={() => handleLinkClick(link.url)}
                >
                  {link.icon && <span className="link-icon">{link.icon}</span>}
                  <span className="link-title">{link.title}</span>
                </button>
              ))
          )}
        </div>

        {/* Back to Home Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'var(--secondary-color)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ← Back To Homepage
          </button>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Powered by <a href="https://sui.io/  " target='_blank' rel='noopener noreferrer' className="blue-link">Sui Blockchain</a></p>
        </footer>
      </div>
    </div>
  );
}

