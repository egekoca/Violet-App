import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getUserProfiles, getProfileByUsername, getUserNFTs, NFT } from '../lib/blockchain';
import { UserProfile } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import './UserPage.css';

export function UserPage() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const account = useCurrentAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  useEffect(() => {
    loadData();
  }, [account, username]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Eğer URL'de username varsa PUBLIC profil görüntüleme
      if (username) {
        console.log('🌐 Public profile mode - Aranan username:', username);
        const publicProfile = await getProfileByUsername(username);
        
        if (publicProfile) {
          setProfile(publicProfile);
        } else {
          setError(`Profile @${username} not found`);
          setProfile(null);
        }
        return;
      }

      // Username yoksa PRIVATE profil görüntüleme (kendi profilim)
      if (!account) {
        setError('Please connect your wallet to view your profile');
        setProfile(null);
        return;
      }

      // Kullanıcının tüm profillerini çek
      const profiles = await getUserProfiles(account.address);
      
      if (profiles.length === 0) {
        setError('No profile found. Create one now!');
        setProfile(null);
      } else {
        // İlk profili göster
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('An error occurred while loading the profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShowNFTs = async () => {
    if (!profile) return;
    
    setShowNFTModal(true);
    setLoadingNFTs(true);
    
    try {
      const userNFTs = await getUserNFTs(profile.owner);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Error loading NFTs:', error);
      alert('Failed to load NFTs');
    } finally {
      setLoadingNFTs(false);
    }
  };

  if (loading) {
    return (
      <div className="user-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Eğer username varsa (public profil), cüzdan gerekmez
  if (!account && !username) {
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

        {/* Admin Button - Sadece kendi profilinde göster */}
        {!username && account && profile && profile.owner === account.address && (
          <button 
            className="admin-btn"
            onClick={() => navigate('/admin')}
            title="Admin Panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 3V5M12 19V21M3 12H5M19 12H21M6.34315 6.34315L7.75736 7.75736M16.2426 16.2426L17.6569 17.6569M6.34315 17.6569L7.75736 16.2426M16.2426 7.75736L17.6569 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Profile Section */}
        <div className="profile-section">
          {profile.image_url ? (
            <img 
              src={profile.image_url} 
              alt={profile.display_name}
              className="avatar-image"
              onError={(e) => {
                // Resim yüklenemezse placeholder göster
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="avatar-placeholder"
            style={{ display: profile.image_url ? 'none' : 'flex' }}
          >
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="display-name">{profile.display_name}</h1>
          <p className="bio">{profile.bio}</p>
          <p className="username-label">@{profile.username}</p>
          
          {/* NFT Gallery Button */}
          <button 
            className="nft-gallery-btn"
            onClick={handleShowNFTs}
            title="View NFT Collection"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>NFT Collection</span>
          </button>
        </div>

        {/* NFT Gallery Modal */}
        {showNFTModal && (
          <div className="nft-modal-overlay" onClick={() => setShowNFTModal(false)}>
            <div className="nft-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="nft-modal-header">
                <h2>🖼️ NFT Collection</h2>
                <button 
                  className="nft-modal-close"
                  onClick={() => setShowNFTModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="nft-modal-body">
                {loadingNFTs ? (
                  <div className="nft-loading">
                    <div className="spinner"></div>
                    <p>Loading NFTs...</p>
                  </div>
                ) : nfts.length === 0 ? (
                  <div className="nft-empty">
                    <p>No NFTs found in this wallet</p>
                  </div>
                ) : (
                  <div className="nft-grid">
                    {nfts.map((nft) => (
                      <div key={nft.id} className="nft-card">
                        <div className="nft-image-container">
                          <img 
                            src={nft.image_url} 
                            alt={nft.name}
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <div className="nft-info">
                          <h4>{nft.name}</h4>
                          {nft.collection && <p className="nft-collection">{nft.collection}</p>}
                          {nft.description && (
                            <p className="nft-description">{nft.description.slice(0, 100)}{nft.description.length > 100 ? '...' : ''}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

