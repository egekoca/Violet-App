import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { 
  getUserProfiles, 
  createProfileTransaction, 
  addLinkTransaction, 
  updateProfileTransaction, 
  updateProfileImageTransaction,
  updateLinkTransaction,
  deleteLinkTransaction,
  toggleLinkTransaction
} from '../lib/blockchain';
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
  const [showEditLinkForm, setShowEditLinkForm] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: '',
    bio: '',
    image_url: '',
  });

  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    icon: '',
    banner: '',
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
        console.log('🆔 Profile ID:', profiles[0].id);
        console.log('🔢 Link IDs:', profiles[0].link_ids);
        console.log('🔢 Link Count:', profiles[0].link_count);
        console.log('🔗 Profile linkler:', profiles[0].links);
        console.log('🔗 Links array mi?', Array.isArray(profiles[0].links));
        console.log('🔗 Links length:', profiles[0].links?.length);
        
        // Her linkin detayını göster
        if (profiles[0].links && profiles[0].links.length > 0) {
          profiles[0].links.forEach((link, idx) => {
            console.log(`  Link ${idx}:`, link);
          });
        }
        
        setProfile(profiles[0]);
        setShowCreateForm(false);
        // Profil formunu mevcut verilerle doldur
        setProfileForm({
          username: profiles[0].username,
          display_name: profiles[0].display_name,
          bio: profiles[0].bio,
          image_url: profiles[0].image_url || '',
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
          onSuccess: async (result) => {
            console.log('✅ Link ekleme transaction başarılı:', result);
            alert('✅ The link has been added! Waiting for blockchain confirmation...');
            
            // Blockchain'de işlenmesi için biraz daha uzun bekle
            setTimeout(async () => {
              console.log('🔄 Link eklendikten sonra veri yenileniyor...');
              await loadData();
              setLinkForm({ title: '', url: '', icon: '', banner: '' });
              setShowAddLinkForm(false);
            }, 5000); // 3 saniyeden 5 saniyeye çıkardık
          },
          onError: (error) => {
            console.error('❌ Transaction hatası:', error);
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
      
      // İlk olarak display_name ve bio'yu güncelle
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
            // Eğer image_url değiştiyse, onu da güncelle
            if (profileForm.image_url !== profile.image_url) {
              const imageTx = updateProfileImageTransaction({
                profileId: profile.id,
                image_url: profileForm.image_url,
              });
              
              signAndExecute(
                { 
                  transaction: imageTx as any,
                },
                {
                  onSuccess: async () => {
                    alert('✅ Profile updated (including image)! Confirming on Blockchain...');
                    setTimeout(() => {
                      loadData();
                      setShowEditProfileForm(false);
                    }, 3000);
                  },
                  onError: (error) => {
                    console.error('Image update error:', error);
                    alert('⚠️ Profile updated but image failed: ' + error.message);
                    setTimeout(() => loadData(), 2000);
                  },
                }
              );
            } else {
              alert('✅ The profile has been updated! Getting it approved in the Blockchain...');
              setTimeout(() => {
                loadData();
                setShowEditProfileForm(false);
              }, 3000);
            }
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

  const handleEditLink = (link: any) => {
    setEditingLinkId(link.id);
    setLinkForm({
      title: link.title,
      url: link.url,
      icon: link.icon,
      banner: link.banner || '',
    });
    setShowEditLinkForm(true);
    setShowAddLinkForm(false);
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !profile || editingLinkId === null) return;

    try {
      setProcessing(true);
      const tx = updateLinkTransaction({
        profileId: profile.id,
        link_id: editingLinkId,
        ...linkForm,
      });

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('✅ Link updated! Confirming on Blockchain...');
            setTimeout(() => {
              loadData();
              setLinkForm({ title: '', url: '', icon: '', banner: '' });
              setShowEditLinkForm(false);
              setEditingLinkId(null);
            }, 3000);
          },
          onError: (error) => {
            console.error('Link update error:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link güncelleme hatası:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!account || !profile) return;
    
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      setProcessing(true);
      const tx = deleteLinkTransaction({
        profileId: profile.id,
        link_id: linkId,
      });

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('✅ Link deleted! Confirming on Blockchain...');
            setTimeout(() => {
              loadData();
            }, 3000);
          },
          onError: (error) => {
            console.error('Link delete error:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link silme hatası:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleLink = async (linkId: number, currentState: boolean) => {
    if (!account || !profile) return;

    try {
      setProcessing(true);
      const tx = toggleLinkTransaction({
        profileId: profile.id,
        link_id: linkId,
        is_active: !currentState,
      });

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert(`✅ Link ${!currentState ? 'activated' : 'deactivated'}!`);
            setTimeout(() => {
              loadData();
            }, 2000);
          },
          onError: (error) => {
            console.error('Link toggle error:', error);
            alert('❌ Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link toggle hatası:', error);
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
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 13C13.866 13 17 16.134 17 20M10 13C6.13401 13 3 16.134 3 20M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Links</span>
          </button>
          <button 
            className={`nav-item ${showEditProfileForm ? 'active' : ''}`}
            onClick={() => setShowEditProfileForm(true)}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 3V5M12 19V21M3 12H5M19 12H21M6.34315 6.34315L7.75736 7.75736M16.2426 16.2426L17.6569 17.6569M6.34315 17.6569L7.75736 16.2426M16.2426 7.75736L17.6569 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span>Settings</span>
          </button>
          <button 
            className="nav-item" 
            onClick={() => {
              if (profile?.username) {
                window.open(`/${profile.username}`, '_blank');
              }
            }}
            disabled={!profile?.username}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span>View Profile</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
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

                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input
                    type="url"
                    value={profileForm.image_url}
                    onChange={(e) => setProfileForm({ ...profileForm, image_url: e.target.value })}
                    placeholder="https://example.com/your-avatar.png"
                    maxLength={500}
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Optional: URL to your profile picture
                  </small>
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

                    <div className="form-group">
                      <label>Profile Picture URL</label>
                      <input
                        type="url"
                        value={profileForm.image_url}
                        onChange={(e) => setProfileForm({ ...profileForm, image_url: e.target.value })}
                        placeholder="https://example.com/your-avatar.png"
                        maxLength={500}
                      />
                      <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        Optional: URL to your profile picture
                      </small>
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

            <div className="form-group">
              <label>Banner URL (Optional)</label>
              <input
                type="url"
                      value={linkForm.banner}
                      onChange={(e) => setLinkForm({ ...linkForm, banner: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
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
                        setLinkForm({ title: '', url: '', icon: '', banner: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
              </div>
        )}

            {/* Edit Link Form */}
            {showEditLinkForm && (
              <div className="link-form-card">
                <h3>Edit Link</h3>
                
                <form onSubmit={handleUpdateLink}>
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

            <div className="form-group">
              <label>Banner URL (Optional)</label>
              <input
                type="url"
                      value={linkForm.banner}
                      onChange={(e) => setLinkForm({ ...linkForm, banner: e.target.value })}
                      placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div className="form-actions">
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={processing}
                    >
                      {processing ? '⏳ Updating...' : 'Update Link'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                        setShowEditLinkForm(false);
                        setLinkForm({ title: '', url: '', icon: '', banner: '' });
                        setEditingLinkId(null);
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
                        className={`link-card-modern ${!link.is_active ? 'inactive' : ''}`}
                      >
                        {/* Banner Thumbnail */}
                        {link.banner ? (
                          <div className="link-banner-thumb">
                            <img 
                              src={link.banner} 
                              alt={link.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="link-banner-placeholder">
                            {link.icon || '🔗'}
                          </div>
                        )}

                        {/* Content */}
                        <div className="link-card-body">
                          <div className="link-card-info">
                            <div className="link-title-row">
                              {link.icon && <span className="link-icon-small">{link.icon}</span>}
                              <h4 className="link-title">{link.title || 'Untitled Link'}</h4>
                              <span className={`link-status-dot ${link.is_active ? 'active' : 'inactive'}`}></span>
                            </div>
                            <p className="link-url">{link.url || 'No URL'}</p>
                          </div>
                          
                          {/* Actions */}
                          <div className="link-card-actions">
                            <button
                              className="link-action-btn-new edit-btn-new"
                              onClick={() => handleEditLink(link)}
                              title="Edit"
                              disabled={processing}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button
                              className={`link-action-btn-new toggle-btn-new ${link.is_active ? 'active' : ''}`}
                              onClick={() => handleToggleLink(link.id, link.is_active)}
                              title={link.is_active ? 'Deactivate' : 'Activate'}
                              disabled={processing}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                {link.is_active ? (
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                ) : (
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                )}
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </button>
                            <button
                              className="link-action-btn-new delete-btn-new"
                              onClick={() => handleDeleteLink(link.id)}
                              title="Delete"
                              disabled={processing}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
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
                href={`https://violet-app.trwal.app/${profile?.username || profileForm.username || 'username'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-url-link"
              >
                violet-app.trwal.app/{profile?.username || profileForm.username || 'username'}
              </a>
              <button
                className="copy-url-btn"
                onClick={() => {
                  const url = `https://violet-app.trwal.app/${profile?.username || profileForm.username || 'username'}`;
                  navigator.clipboard.writeText(url);
                  alert('✅ Link copied to clipboard!');
                }}
                title="Copy link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="preview-phone">
          <div className="phone-frame">
            <div className="phone-screen">
              {profile || showCreateForm ? (
                <>
                  {(showEditProfileForm ? profileForm.image_url : profile?.image_url || profileForm.image_url) ? (
                    <img 
                      src={showEditProfileForm ? profileForm.image_url : profile?.image_url || profileForm.image_url}
                      alt="Profile"
                      className="preview-avatar preview-avatar-image"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="preview-avatar"
                    style={{ display: (showEditProfileForm ? profileForm.image_url : profile?.image_url || profileForm.image_url) ? 'none' : 'flex' }}
                  >
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
                    {profile && profile.links.filter(link => link.is_active).length > 0 ? (
                      profile.links.filter(link => link.is_active).slice(0, 3).map((link, index) => (
                        <a 
                          key={index} 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="preview-link-modern"
                        >
                          {link.banner ? (
                            <div className="preview-link-banner">
                              <img src={link.banner} alt={link.title} onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                          ) : (
                            <div className="preview-link-icon-box">
                              {link.icon || '🔗'}
                            </div>
                          )}
                          <div className="preview-link-text">
                            <span className="preview-link-title">{link.title}</span>
                            {link.icon && <span className="preview-link-icon-small">{link.icon}</span>}
                          </div>
                        </a>
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
