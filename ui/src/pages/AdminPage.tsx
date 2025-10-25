import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, createProfileTransaction, addLinkTransaction, updateProfileTransaction } from '../lib/blockchain';
import { UserProfile } from '../types';
import { WalletConnect } from '../components/WalletConnect';
import './AdminPage.css';

export function AdminPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: '',
    bio: '',
  });

  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    icon: '',
  });

  useEffect(() => {
    loadData();
  }, [account]);

  const loadData = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 loadData başladı, account:', account.address);
      
      const profiles = await getUserProfiles(account.address);
      console.log('📥 getUserProfiles sonucu:', profiles);
      
      if (profiles.length > 0) {
        console.log('✅ Profil bulundu:', profiles[0]);
        console.log('🔗 Profile linkler:', profiles[0].links);
        console.log('🔗 Links array mi?', Array.isArray(profiles[0].links));
        console.log('🔗 Links length:', profiles[0].links?.length);
        
        setProfile(profiles[0]);
        setShowCreateForm(false);
        // Profil formunu mevcut verilerle doldur
        setProfileForm({
          username: profiles[0].username,
          display_name: profiles[0].display_name,
          bio: profiles[0].bio,
        });
      } else {
        console.log('❌ Profil bulunamadı');
        setProfile(null);
        setShowCreateForm(true);
      }
    } catch (error) {
      console.error('❌ Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    try {
      setProcessing(true);
      const tx = createProfileTransaction(profileForm);

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('✅ Your profile has been created! You can begin adding your links!');
            // 3 saniye bekle ve reload
            setTimeout(() => {
              loadData();
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil oluşturma hatası:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !profile) return;

    try {
      setProcessing(true);
      const tx = addLinkTransaction({
        profileId: profile.id,
        ...linkForm,
      });

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('✅ The link has been added! Getting it approved in the Blockchain...');
            setTimeout(() => {
              loadData();
              setLinkForm({ title: '', url: '', icon: '' });
              setShowAddLinkForm(false);
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link ekleme hatası:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !profile) return;

    try {
      setProcessing(true);
      const tx = updateProfileTransaction({
        profileId: profile.id,
        display_name: profileForm.display_name,
        bio: profileForm.bio,
      });

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('✅ The profile has been updated! Getting it approved in the Blockchain...');
            setTimeout(() => {
              loadData();
              setShowEditProfileForm(false);
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil güncelleme hatası:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="admin-page">
        <div className="container">
          <h1>🔐 Wallet Connection Is Required</h1>
          <p style={{ marginBottom: '24px' }}>
            Please connect with your wallet to access to the admin panel
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🔗</span>
            <span className="logo-text">VIOLET</span>
          </div>
        </div>

        {profile && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{profile.username}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <h4 className="nav-section-title">My Violet</h4>
          <button 
            className={`nav-item ${!showEditProfileForm ? 'active' : ''}`}
            onClick={() => setShowEditProfileForm(false)}
          >
            <span className="nav-icon">🔗</span>
            <span>Links</span>
          </button>
          <button 
            className={`nav-item ${showEditProfileForm ? 'active' : ''}`}
            onClick={() => setShowEditProfileForm(true)}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
          <button 
            className="nav-item" 
            onClick={() => {
              if (profile?.username) {
                window.open(`/@${profile.username}`, '_blank');
              }
            }}
            disabled={!profile?.username}
          >
            <span className="nav-icon">👤</span>
            <span>View Profile</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span>
            <span>Main Page</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <WalletConnect />
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Create Profile Form */}
        {showCreateForm && (
          <div className="main-content-centered">
            <div className="create-profile-card">
              <h2>🎉 Create A New Profile</h2>
              <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
                Create your profile on the Blockchain
              </p>
              
              <form onSubmit={handleCreateProfile}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    placeholder="john_doe_123"
                    required
                    minLength={3}
                    maxLength={20}
                  />
                </div>

                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={profileForm.display_name}
                    onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                    placeholder="John Doe"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <input
                    type="text"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="All my links are here!"
                    required
                    maxLength={200}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn-large"
                  disabled={processing}
                >
                  {processing ? '⏳ Creating...' : '✅ Sign In'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {profile && (
          <div className="main-content">
            {/* Top Profile Bar */}
            <div className="content-header">
              <div className="header-profile">
                <div className="header-avatar">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="header-username">@{profile.username}</h2>
                  <p className="header-bio">{profile.bio || 'Bio ekle'}</p>
                </div>
              </div>
            </div>

            {/* SETTINGS VIEW - Profil Düzenleme */}
            {showEditProfileForm ? (
              <div className="settings-content">
                <h2 className="section-title">⚙️ Profile Settings</h2>
                
                <div className="link-form-card">
                  <h3>Edit Your Profile</h3>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Username cannot be changed
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Display Name</label>
                      <input
                        type="text"
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                        placeholder="John Doe"
                        required
                        maxLength={50}
                      />
                    </div>

                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="All my links are here!"
                        required
                        maxLength={200}
                        rows={4}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={processing}
                    >
                      {processing ? '⏳ Saving...' : '💾 Save'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                {/* LINKS VIEW - Link Yönetimi */}
                {/* Add Button */}
                {!showAddLinkForm && (
                  <button 
                    className="add-main-btn"
                    onClick={() => setShowAddLinkForm(true)}
                  >
                    ➕ Add
                  </button>
                )}

            {/* Add Link Form */}
            {showAddLinkForm && (
              <div className="link-form-card">
                <h3>Add New Link</h3>
                
                <form onSubmit={handleAddLink}>
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      placeholder="Instagram"
                required
                      maxLength={50}
              />
            </div>

            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://instagram.com/..."
                required
              />
            </div>

            <div className="form-group">
              <label>Icon (Emoji)</label>
              <input
                type="text"
                      value={linkForm.icon}
                      onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                placeholder="📸"
                maxLength={2}
              />
            </div>

            <div className="form-actions">
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={processing}
                    >
                      {processing ? '⏳ Adding...' : 'Add Link'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                        setShowAddLinkForm(false);
                        setLinkForm({ title: '', url: '', icon: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
              </div>
        )}

        {/* Links List */}
                <div className="links-section">
                  {profile.links.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">🌴</span>
                      <p className="empty-title">Show the world who you are.</p>
                      <p className="empty-subtitle">Add a link to get started.</p>
                    </div>
                  ) : (
                    profile.links.map((link, index) => (
                      <div 
                        key={index} 
                        className={`link-card ${!link.is_active ? 'inactive' : ''}`}
                      >
                        <div className="link-card-left">
                          {link.icon && <span className="link-card-icon">{link.icon}</span>}
                          <div className="link-card-content">
                    <h4>{link.title}</h4>
                    <p>{link.url}</p>
                  </div>
                </div>
                        <div className="link-card-right">
                          <span className="status-badge">
                            {link.is_active ? '✓' : '✕'}
                          </span>
                </div>
              </div>
            ))
          )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Preview Panel */}
      <aside className="admin-preview">
        {/* Public URL Display */}
        {(profile || showCreateForm) && (
          <div className="preview-url-section">
            <label className="preview-url-label">Your Violet URL</label>
            <div className="preview-url-box">
              <a 
                href={`https://violet-app.trwal.app/@${profile?.username || profileForm.username || 'username'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-url-link"
              >
                violet-app.trwal.app/@{profile?.username || profileForm.username || 'username'}
              </a>
              <button
                className="copy-url-btn"
                onClick={() => {
                  const url = `https://violet-app.trwal.app/@${profile?.username || profileForm.username || 'username'}`;
                  navigator.clipboard.writeText(url);
                  alert('✅ Link copied to clipboard!');
                }}
                title="Copy link"
              >
                📋
              </button>
            </div>
          </div>
        )}
        
        <div className="preview-phone">
          <div className="phone-frame">
            <div className="phone-screen">
              {profile || showCreateForm ? (
                <>
                  <div className="preview-avatar">
                    {(showEditProfileForm && profileForm.username 
                      ? profileForm.username 
                      : profile?.username || profileForm.username || 'V'
                    ).charAt(0).toUpperCase()}
                  </div>
                  <h3 className="preview-name">
                    {showEditProfileForm 
                      ? profileForm.display_name || 'Display Name' 
                      : profile?.display_name || profileForm.display_name || 'Display Name'}
                  </h3>
                  <p className="preview-username">
                    @{showEditProfileForm 
                      ? profileForm.username || profile?.username || 'kullaniciadi'
                      : profile?.username || profileForm.username || 'kullaniciadi'}
                  </p>
                  <p className="preview-bio">
                    {showEditProfileForm 
                      ? profileForm.bio || 'A short biography is displayed here...'
                      : profile?.bio || profileForm.bio || 'A short biography...'}
                  </p>
                  
                  <div className="preview-links">
                    {profile && profile.links.length > 0 ? (
                      profile.links.slice(0, 3).map((link, index) => (
                        <div key={index} className="preview-link">
                          {link.icon && <span>{link.icon}</span>}
                          <span>{link.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="preview-empty">No link has been added yet</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="preview-placeholder">
                  <p>Profil Preview</p>
                </div>
              )}
            </div>
        </div>
      </div>
      </aside>
    </div>
  );
}
