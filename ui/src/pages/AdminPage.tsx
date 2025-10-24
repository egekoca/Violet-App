import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, createProfileTransaction, addLinkTransaction } from '../lib/blockchain';
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
            alert('✅ Profil oluşturuldu! Blockchain\'de onaylanıyor...');
            // 3 saniye bekle ve reload
            setTimeout(() => {
              loadData();
              setProfileForm({ username: '', display_name: '', bio: '' });
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
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          {profile && (
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Profili Gör
            </button>
          )}
          <h1>Admin Paneli</h1>
          <div style={{ marginLeft: 'auto' }}>
            <WalletConnect />
          </div>
        </div>

        {/* Create Profile Form */}
        {showCreateForm && (
          <div className="link-form">
            <h3>🎉 Yeni Profil Oluştur</h3>
            <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
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
                className="submit-btn"
                disabled={processing}
              >
                {processing ? '⏳ İşleniyor...' : '✅ Profil Oluştur'}
              </button>
            </form>
          </div>
        )}

        {/* Profile Info */}
        {profile && (
          <>
            <div className="profile-info">
              <div className="avatar-small">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{profile.display_name}</h2>
                <p>@{profile.username}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  ID: {profile.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Add Link Button */}
            {!showAddLinkForm && (
              <button 
                className="add-link-btn"
                onClick={() => setShowAddLinkForm(true)}
              >
                + Yeni Link Ekle
              </button>
            )}

            {/* Add Link Form */}
            {showAddLinkForm && (
              <div className="link-form">
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
            <div className="links-list">
              <h3>Linkler ({profile.links.length})</h3>
              {profile.links.length === 0 ? (
                <p className="no-links">Henüz link eklenmemiş</p>
              ) : (
                profile.links.map((link, index) => (
                  <div 
                    key={index} 
                    className={`link-item ${!link.is_active ? 'inactive' : ''}`}
                  >
                    <div className="link-info">
                      {link.icon && <span className="link-icon">{link.icon}</span>}
                      <div className="link-details">
                        <h4>{link.title}</h4>
                        <p>{link.url}</p>
                      </div>
                    </div>
                    <div className="link-actions">
                      <span className="link-status">
                        {link.is_active ? '✅ Aktif' : '❌ Pasif'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
