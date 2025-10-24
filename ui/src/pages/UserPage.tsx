import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getUserProfile, getUserProfiles } from '../lib/blockchain';
import { UserProfile } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import './UserPage.css';

export function UserPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [username, account]);

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
        setError('Henüz profil oluşturmadınız. Profil oluşturmak için admin paneline gidin.');
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
          <h2>🔐 Cüzdan Bağlantısı Gerekli</h2>
          <p style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.8)' }}>
            Profilinizi görüntülemek için lütfen cüzdanınızı bağlayın
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
          {error.includes('oluşturmadınız') && (
            <button 
              className="create-profile-btn"
              onClick={() => navigate('/admin/new')}
              style={{
                marginTop: '24px',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Profil Oluştur
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-page error">
        <h2>Profil bulunamadı</h2>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="container">
        {/* Wallet Connection */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
          <WalletConnect />
        </div>

        {/* Admin Button */}
        <button 
          className="admin-btn"
          onClick={() => navigate(`/admin/${profile.username}`)}
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
            <p className="no-links">Henüz link eklenmemiş</p>
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

        {/* Footer */}
        <footer className="footer">
          <p>Powered by Sui Blockchain ⚡</p>
        </footer>
      </div>
    </div>
  );
}

