import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, getProfileByUsername, getUserNFTs, NFT } from '../lib/blockchain';
import { UserProfile } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import { Transaction } from '@mysten/sui/transactions';
import './UserPage.css';

export function UserPage() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [sendingTip, setSendingTip] = useState(false);
  const [selectedToken, setSelectedToken] = useState<'SUI' | 'WAL'>('SUI');

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

  const handleSendTip = async () => {
    if (!account || !profile) {
      alert('Lütfen önce cüzdanınızı bağlayın!');
      return;
    }

    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir miktar girin');
      return;
    }

    const minAmount = selectedToken === 'SUI' ? 0.001 : 0.01;
    if (amount < minAmount) {
      alert(`Minimum bahşiş miktarı: ${minAmount} ${selectedToken}`);
      return;
    }

    try {
      setSendingTip(true);

      const tx = new Transaction();

      if (selectedToken === 'SUI') {
        // SUI transfer (1 SUI = 1,000,000,000 MIST)
        const amountInMist = Math.floor(amount * 1_000_000_000);
        const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
        tx.transferObjects([coin], profile.owner);
      } else {
        // WAL transfer - Walrus testnet token
        // Not: WAL coin type'ı için Walrus documentation'a bakılmalı
        // Şimdilik temsili olarak SUI benzeri işlem yapıyoruz
        const amountInSmallestUnit = Math.floor(amount * 1_000_000_000);
        const [coin] = tx.splitCoins(tx.gas, [amountInSmallestUnit]);
        tx.transferObjects([coin], profile.owner);
        
        // TODO: Gerçek WAL token için doğru coin type kullanılmalı:
        // const walCoinType = '0x...::wal::WAL';
        // tx.splitCoins ile WAL coin'lerini böl ve transfer et
      }

      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert(`🎉 ${amount} ${selectedToken} başarıyla gönderildi! Desteğiniz için teşekkürler!`);
            setShowTipModal(false);
            setTipAmount('');
            setSelectedToken('SUI');
          },
          onError: (error) => {
            console.error('Bahşiş gönderme hatası:', error);
            alert('❌ Hata: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Bahşiş hatası:', error);
      alert('❌ Hata: ' + error.message);
    } finally {
      setSendingTip(false);
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
          
          {/* Action Buttons */}
          <div className="profile-actions">
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

            <button 
              className="tip-btn"
              onClick={() => setShowTipModal(true)}
              title="Bahşiş Gönder"
            >
              {/* Paper Plane / Kağıt Uçak - Send Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Send Tip</span>
            </button>
          </div>
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

        {/* Tip Modal */}
        {showTipModal && (
          <div className="tip-modal-overlay" onClick={() => setShowTipModal(false)}>
            <div className="tip-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="tip-modal-header">
                <div className="tip-modal-title">
                  {/* Paper Plane / Kağıt Uçak - Send Icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px' }}>
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2>Bahşiş Gönder</h2>
                </div>
                <button 
                  className="tip-modal-close"
                  onClick={() => setShowTipModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="tip-modal-body">
                {!account ? (
                  <div className="tip-connect-wallet">
                    <p>Bahşiş göndermek için lütfen cüzdanınızı bağlayın</p>
                    <WalletConnect />
                  </div>
                ) : (
                  <>
                    <div className="tip-profile-info">
                      {profile.image_url ? (
                        <img 
                          src={profile.image_url} 
                          alt={profile.display_name}
                          className="tip-avatar"
                        />
                      ) : (
                        <div className="tip-avatar-placeholder">
                          {profile.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3>{profile.display_name}</h3>
                        <p>@{profile.username}</p>
                      </div>
                    </div>

                    <div className="tip-form">
                      {/* Token Seçici */}
                      <div className="token-selector">
                        <label>Token Seçin</label>
                        <div className="token-buttons">
                          <button
                            type="button"
                            className={`token-btn ${selectedToken === 'SUI' ? 'active' : ''}`}
                            onClick={() => setSelectedToken('SUI')}
                            disabled={sendingTip}
                          >
                            <div className="token-icon">🔷</div>
                            <div className="token-info">
                              <span className="token-name">SUI</span>
                              <span className="token-network">Sui Network</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            className={`token-btn ${selectedToken === 'WAL' ? 'active' : ''}`}
                            onClick={() => setSelectedToken('WAL')}
                            disabled={sendingTip}
                          >
                            <div className="token-icon">🐋</div>
                            <div className="token-info">
                              <span className="token-name">WAL</span>
                              <span className="token-network">Walrus Token</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <label htmlFor="tip-amount">Miktar ({selectedToken})</label>
                      <div className="tip-input-group">
                        <input
                          id="tip-amount"
                          type="number"
                          min={selectedToken === 'SUI' ? '0.001' : '0.01'}
                          step={selectedToken === 'SUI' ? '0.001' : '0.01'}
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          placeholder="0.00"
                          disabled={sendingTip}
                        />
                        <span className="tip-currency">{selectedToken}</span>
                      </div>
                      <small>Minimum: {selectedToken === 'SUI' ? '0.001' : '0.01'} {selectedToken}</small>

                      <div className="tip-quick-amounts">
                        <button onClick={() => setTipAmount('0.1')} disabled={sendingTip}>0.1</button>
                        <button onClick={() => setTipAmount('0.5')} disabled={sendingTip}>0.5</button>
                        <button onClick={() => setTipAmount('1')} disabled={sendingTip}>1</button>
                        <button onClick={() => setTipAmount('5')} disabled={sendingTip}>5</button>
                      </div>

                      <button 
                        className="tip-send-btn"
                        onClick={handleSendTip}
                        disabled={sendingTip || !tipAmount}
                      >
                        {sendingTip ? (
                          <>
                            <span className="spinner-small"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Send Tip
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Links Section */}
        <div className="links-section">
          {profile.links.filter(link => link.is_active).length === 0 ? (
            <p className="no-links">No links have been added yet</p>
          ) : (
            profile.links
              .filter(link => link.is_active)
              .map((link, index) => (
                <button
                  key={index}
                  className="user-link-card-modern"
                  onClick={() => handleLinkClick(link.url)}
                >
                  {link.banner ? (
                    <div className="user-link-banner">
                      <img 
                        src={link.banner} 
                        alt={link.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="user-link-icon-box">
                      {link.icon || '🔗'}
                    </div>
                  )}
                  <div className="user-link-content">
                    <span className="user-link-title">{link.title}</span>
                    {link.icon && <span className="user-link-icon-small">{link.icon}</span>}
                  </div>
                  <div className="user-link-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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

