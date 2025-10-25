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
      const profiles = await getUserProfiles(account.address);
      
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setShowCreateForm(false);
        // Profil formunu mevcut verilerle doldur
        setProfileForm({
          username: profiles[0].username,
          display_name: profiles[0].display_name,
          bio: profiles[0].bio,
        });
      } else {
        setProfile(null);
        setShowCreateForm(true);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
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
            alert('✅ Profil oluşturuldu! Link eklemeye başlayabilirsin!');
            // 3 saniye bekle ve reload
            setTimeout(() => {
              loadData();
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Hata: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil oluşturma hatası:', error);
      alert('Hata: ' + error.message);
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
            alert('✅ Link eklendi! Blockchain\'de onaylanıyor...');
            setTimeout(() => {
              loadData();
              setLinkForm({ title: '', url: '', icon: '' });
              setShowAddLinkForm(false);
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Hata: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link ekleme hatası:', error);
      alert('Hata: ' + error.message);
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
            alert('✅ Profil güncellendi! Blockchain\'de onaylanıyor...');
            setTimeout(() => {
              loadData();
              setShowEditProfileForm(false);
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Hata: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil güncelleme hatası:', error);
      alert('Hata: ' + error.message);
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
          <h1>🔐 Cüzdan Bağlantısı Gerekli</h1>
          <p style={{ marginBottom: '24px' }}>
            Admin paneline erişmek için cüzdanınızı bağlayın
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
          <h4 className="nav-section-title">My Linktree</h4>
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
          <button className="nav-item" onClick={() => navigate('/my-profile')}>
            <span className="nav-icon">👤</span>
            <span>Profili Gör</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span>
            <span>Ana Sayfa</span>
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
              <h2>🎉 Yeni Profil Oluştur</h2>
              <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
                Blockchain üzerinde profilinizi oluşturun
              </p>
              
              <form onSubmit={handleCreateProfile}>
                <div className="form-group">
                  <label>Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    placeholder="ahmet123"
                    required
                    minLength={3}
                    maxLength={20}
                  />
                </div>

                <div className="form-group">
                  <label>Görünen İsim</label>
                  <input
                    type="text"
                    value={profileForm.display_name}
                    onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                    placeholder="Ahmet Yılmaz"
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
                    placeholder="Tüm linklerim burada 🚀"
                    required
                    maxLength={200}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn-large"
                  disabled={processing}
                >
                  {processing ? '⏳ İşleniyor...' : '✅ Profil Oluştur'}
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
                <h2 className="section-title">⚙️ Profil Ayarları</h2>
                
                <div className="link-form-card">
                  <h3>Profil Bilgilerini Düzenle</h3>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label>Kullanıcı Adı</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Kullanıcı adı değiştirilemez
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Görünen İsim</label>
                      <input
                        type="text"
                        value={profileForm.display_name}
                        onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                        placeholder="Ahmet Yılmaz"
                        required
                        maxLength={50}
                      />
                    </div>

                    <div className="form-group">
                      <label>Biyografi</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Tüm linklerim burada 🚀"
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
                      {processing ? '⏳ Güncelleniyor...' : '💾 Kaydet'}
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
                <h3>Yeni Link Ekle</h3>
                
                <form onSubmit={handleAddLink}>
                  <div className="form-group">
                    <label>Başlık</label>
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
                    <label>İkon (Emoji)</label>
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
                      {processing ? '⏳ Ekleniyor...' : 'Ekle'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowAddLinkForm(false);
                        setLinkForm({ title: '', url: '', icon: '' });
                      }}
                    >
                      İptal
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
                      ? profileForm.display_name || 'Görünen İsim' 
                      : profile?.display_name || profileForm.display_name || 'Görünen İsim'}
                  </h3>
                  <p className="preview-username">
                    @{showEditProfileForm 
                      ? profileForm.username || profile?.username || 'kullaniciadi'
                      : profile?.username || profileForm.username || 'kullaniciadi'}
                  </p>
                  <p className="preview-bio">
                    {showEditProfileForm 
                      ? profileForm.bio || 'Kısa biyografiniz burada görünür...'
                      : profile?.bio || profileForm.bio || 'Kısa biyografiniz...'}
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
                      <p className="preview-empty">Henüz link eklenmemiş</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="preview-placeholder">
                  <p>Profil önizlemesi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
