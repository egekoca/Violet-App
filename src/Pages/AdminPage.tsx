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
} from '../Utils/MoveCalls';
import { UserProfile } from '../Utils/Types';
import { WalletConnect } from '../Components/WalletConnect';
import toast from 'react-hot-toast';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('suggested');

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

  // Platform presets
  const platformPresets = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Display your posts and reels',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
      baseUrl: 'https://instagram.com/',
      category: 'social',
      color: '#E4405F'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Share your TikToks on your Violet',
      icon: 'https://seeklogo.com/images/T/tiktok-icon-logo-1CB398A1BD-seeklogo.com.png',
      baseUrl: 'https://tiktok.com/@',
      category: 'social',
      color: '#000000'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Share YouTube videos on your Violet',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      baseUrl: 'https://youtube.com/',
      category: 'media',
      color: '#FF0000'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Share your latest or favorite music',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      baseUrl: 'https://open.spotify.com/',
      category: 'media',
      color: '#1DB954'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      description: 'Share your X profile',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png',
      baseUrl: 'https://x.com/',
      category: 'social',
      color: '#000000'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Share your professional profile',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
      baseUrl: 'https://linkedin.com/in/',
      category: 'social',
      color: '#0A66C2'
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Share your code and projects',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      baseUrl: 'https://github.com/',
      category: 'contact',
      color: '#181717'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Share your Facebook profile',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
      baseUrl: 'https://facebook.com/',
      category: 'social',
      color: '#1877F2'
    },
    {
      id: 'twitch',
      name: 'Twitch',
      description: 'Share your live streams',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg',
      baseUrl: 'https://twitch.tv/',
      category: 'media',
      color: '#9146FF'
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Share your Discord server',
      icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Discord_logo.svg',
      baseUrl: 'https://discord.gg/',
      category: 'contact',
      color: '#5865F2'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Share your WhatsApp contact',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      baseUrl: 'https://wa.me/',
      category: 'contact',
      color: '#25D366'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Share your Telegram',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      baseUrl: 'https://t.me/',
      category: 'contact',
      color: '#26A5E4'
    },
  ];

  const categories = [
    { id: 'suggested', name: 'Suggested', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'social', name: 'Social', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5923C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    )},
    { id: 'media', name: 'Media', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'contact', name: 'Contact', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9206 21 20.9206H3C2.44772 20.9206 2 20.4728 2 19.92V16.92C2 16.3673 2.44772 15.9195 3 15.9195H21C21.5523 15.9195 22 16.3673 22 16.92Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 4.92047V7.92047C22 8.47276 21.5523 8.92047 21 8.92047H3C2.44772 8.92047 2 8.47276 2 7.92047V4.92047C2 4.36819 2.44772 3.92047 3 3.92047H21C21.5523 3.92047 22 4.36819 22 4.92047Z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12.4205" r="1.5" fill="currentColor"/>
      </svg>
    )},
    { id: 'text', name: 'Custom', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M10 13C13.866 13 17 16.134 17 20M10 13C6.13401 13 3 16.134 3 20M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
  ];

  const filteredPlatforms = platformPresets.filter(platform => {
    const matchesCategory = selectedCategory === 'suggested' || platform.category === selectedCategory;
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      console.log('loadData has started, account:', account.address);

      const profiles = await getUserProfiles(account.address);
      console.log('getUserProfiles result:', profiles);

      if (profiles.length > 0) {
        console.log('Found profile:', profiles[0]);
        console.log('Profile ID:', profiles[0].id);
        console.log('Link IDs:', profiles[0].link_ids);
        console.log('Link Count:', profiles[0].link_count);
        console.log('Profile links:', profiles[0].links);
        console.log('Are links an array?', Array.isArray(profiles[0].links));
        console.log('Links length:', profiles[0].links?.length);

        // Log details about each link
        if (profiles[0].links && profiles[0].links.length > 0) {
          profiles[0].links.forEach((link, idx) => {
            console.log(`Link ${idx}:`, link);
          });
        }

        setProfile(profiles[0]);
        setShowCreateForm(false);
        // Fill the profile form with data
        setProfileForm({
          username: profiles[0].username,
          display_name: profiles[0].display_name,
          bio: profiles[0].bio,
          image_url: profiles[0].image_url || '',
        });
      } else {
        console.log('No profile has been found');
        setProfile(null);
        setShowCreateForm(true);
      }
    } catch (error) {
      console.error('Profile load error:', error);
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
            toast.success('Your profile has been created! You can begin adding your links!');
            // 3 saniye bekle ve reload
            setTimeout(() => {
              loadData();
            }, 3000);
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            toast.error('Transaction error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profile create error:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectPlatform = (platform: any) => {
    setLinkForm({
      title: platform.name,
      url: platform.baseUrl,
      icon: '',
      banner: platform.icon,
    });
    setSelectedCategory('text'); // Switch to form view
  };

  const handleCustomLink = () => {
    setLinkForm({
      title: '',
      url: '',
      icon: '',
      banner: '',
    });
    setSelectedCategory('text'); // Switch to form view
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !profile) return;

    try {
      setProcessing(true);

      // Check if using zkLogin
      const isZkLogin = account?.address.startsWith('0x') && account?.address.length > 40;

      if (isZkLogin) {
        // Make a transaction with Enoki
        console.log('Adding a link with Enoki...');

      const tx = addLinkTransaction({
        profileId: profile.id,
        ...linkForm,
      });

        // Enoki wallet handles sponsored transactions automatically
        signAndExecute(
          { transaction: tx as any },
          {
            onSuccess: async (result) => {
              console.log('Enoki transaction successfull:', result);
              toast.success('The link has been added with Enoki sponsored transaction! (No gas fee)');

              // Update the UI immediately (optimistic update)
              const newLink = {
                id: Date.now(), // Temporary ID
                title: linkForm.title,
                url: linkForm.url,
                icon: linkForm.icon,
                banner: linkForm.banner,
                is_active: true,
                order: (profile.links?.length || 0) + 1
              };

              // Update the profile
              setProfile(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  links: [...(prev.links || []), newLink]
                };
              });

              // Clear the form
              setLinkForm({ title: '', url: '', icon: '', banner: '' });
              setShowAddLinkForm(false);
              setSearchQuery('');
              setSelectedCategory('suggested');

              // Load the latest data from the blockchain in the background
              setTimeout(async () => {
                console.log('Updating blockchain in the background...');
                try {
                  await loadData();
                  console.log('Blockchain data has been synced.');
                } catch (error) {
                  console.error('Blockchain sync error:', error);
                }
              }, 3000);
            },
            onError: (error) => {
              console.error('Enoki transaction error:', error);
              toast.error('Enoki Error: ' + error.message);
            }
          }
        );
      } else {
        // Normal transaction
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
            console.log('Link add transaction successful:', result);
            toast.success('The link has been added! Waiting for blockchain confirmation...');

            // Wait for it to happen in the blockchain
            setTimeout(async () => {
              console.log('Updating the data after adding the link');
              await loadData();
              setLinkForm({ title: '', url: '', icon: '', banner: '' });
              setShowAddLinkForm(false);
                setSearchQuery('');
                setSelectedCategory('suggested');
              }, 5000);
          },
          onError: (error) => {
            console.error('❌ Transaction error:', error);
            toast.error('Transaction Error: ' + error.message);
          },
        }
      );
      }
    } catch (error: any) {
      console.error('Link add error:', error);
      toast.error('Error While Adding A Link: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !profile) return;

    try {
      setProcessing(true);

      // Firstly, update the display name and bio
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
            // If the image_url had been changed, update that too
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
                    toast.success('Profile updated (including image)! Confirming on Blockchain...');
                    setTimeout(() => {
                      loadData();
                      setShowEditProfileForm(false);
                    }, 3000);
                  },
                  onError: (error) => {
                    console.error('Image update error:', error);
                    toast.error('Profile updated but image failed: ' + error.message);
                    setTimeout(() => loadData(), 2000);
                  },
                }
              );
            } else {
              toast.success('The profile has been updated! Getting it approved in the Blockchain...');
              setTimeout(() => {
                loadData();
                setShowEditProfileForm(false);
              }, 3000);
            }
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            toast.error('Transaction Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil Update error:', error);
      toast.error('Profile Update Error: ' + error.message);
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
            toast.success('Link updated! Confirming on Blockchain...');
            setTimeout(() => {
              loadData();
              setLinkForm({ title: '', url: '', icon: '', banner: '' });
              setShowEditLinkForm(false);
              setEditingLinkId(null);
            }, 3000);
          },
          onError: (error) => {
            console.error('Link update error:', error);
            toast.error('Link Update Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link update error:', error);
      toast.error('Link Update Error: ' + error.message);
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
            toast.success('Link deleted! Confirming on Blockchain...');
            setTimeout(() => {
              loadData();
            }, 3000);
          },
          onError: (error) => {
            console.error('Link delete error:', error);
            toast.error('Link Delete Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link Delete Error:', error);
      toast.error('Link Delete Error: ' + error.message);
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
            toast.success(`Link ${!currentState ? 'activated' : 'deactivated'}!`);
            setTimeout(() => {
              loadData();
            }, 2000);
          },
          onError: (error) => {
            console.error('Link toggle error:', error);
            toast.error('Link Toggle Error: ' + error.message);
          },
        }
      );
    } catch (error: any) {
      console.error('Link toggle error:', error);
      toast.error('Link Toggle Error: ' + error.message);
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
            Please connect with your wallet to access to the admin dashboard.
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
            <img src="/violet2.png" alt="Violet" className="logo-image" />
            <span className="logo-text">VIOLET</span>
          </div>
        </div>

        {profile && (
          <div className="sidebar-user">
            {profile.image_url ? (
              <img
                src={profile.image_url}
                alt={profile.username}
                className="user-avatar user-avatar-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="user-avatar"
              style={{ display: profile.image_url ? 'none' : 'flex' }}
            >
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
                {profile.image_url ? (
                  <img
                    src={profile.image_url}
                    alt={profile.username}
                    className="header-avatar header-avatar-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="header-avatar"
                  style={{ display: profile.image_url ? 'none' : 'flex' }}
                >
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
                {/* LINKS VIEW - Link Management */}
                {/* Add Button */}
                {!showAddLinkForm && (
                  <button
                    className="add-main-btn"
                    onClick={() => setShowAddLinkForm(true)}
                  >
                    ➕ Add
                  </button>
                )}

            {/* Add Link Modal */}
            {showAddLinkForm && (
              <div className="add-link-modal-overlay" onClick={() => {
                setShowAddLinkForm(false);
                setSearchQuery('');
                setSelectedCategory('suggested');
                setLinkForm({ title: '', url: '', icon: '', banner: '' });
              }}>
                <div className="add-link-modal" onClick={(e) => e.stopPropagation()}>
                  {/* Modal Header */}
                  <div className="modal-header-new">
                    <h2>Add</h2>
                    <button
                      className="modal-close-btn"
                      onClick={() => {
                        setShowAddLinkForm(false);
                        setSearchQuery('');
                        setSelectedCategory('suggested');
                        setLinkForm({ title: '', url: '', icon: '', banner: '' });
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="modal-search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Paste or search a link"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Modal Body */}
                  <div className="modal-body-new">
                    {/* Left Sidebar - Categories */}
                    <div className="modal-sidebar">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          <span className="category-icon">{cat.icon}</span>
                          <span className="category-name">{cat.name}</span>
                        </button>
                      ))}
                      <button
                        className="category-item"
                        onClick={handleCustomLink}
                      >
                        <span className="category-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M10 13C10 13 9 14 9 15C9 16 10 17 11 17H13C14 17 15 16 15 15C15 14 14 13 14 13M13.828 10.172C14.39 9.61 14.39 8.707 13.828 8.146L11.854 6.172C11.292 5.61 10.389 5.61 9.828 6.172L6 10C5.438 10.562 5.438 11.465 6 12.026L7.974 14C8.536 14.562 9.439 14.562 10 14M18 13.828C18.562 14.39 18.562 15.293 18 15.854L16.026 17.828C15.464 18.39 14.561 18.39 14 17.828L10.172 14C9.61 13.438 9.61 12.535 10.172 11.974L12.146 10C12.708 9.438 13.611 9.438 14.172 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className="category-name">Custom Link</span>
                      </button>
                    </div>

                    {/* Right Content */}
                    <div className="modal-content-area">
                      {selectedCategory === 'text' ? (
                        /* Custom Link Form */
                        <form onSubmit={handleAddLink} className="custom-link-form">
                          <h3>Custom Link</h3>

            <div className="form-group">
                            <label>Title</label>
              <input
                type="text"
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                              placeholder="My Awesome Link"
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
                              placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Icon (Emoji)</label>
              <input
                type="text"
                      value={linkForm.icon}
                      onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                              placeholder="🔗"
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
                              className="submit-btn-modal"
                      disabled={processing}
                    >
                              {processing ? '⏳ Adding...' : '✅ Add Link'}
              </button>
              <button
                type="button"
                              className="cancel-btn-modal"
                              onClick={() => setSelectedCategory('suggested')}
                            >
                              ← Back
              </button>
            </div>
          </form>
                      ) : (
                        /* Platform Grid */
                        <div className="platform-grid">
                          {filteredPlatforms.length === 0 ? (
                            <div className="no-results">
                              <p>No platforms found</p>
                            </div>
                          ) : (
                            filteredPlatforms.map(platform => (
                              <button
                                key={platform.id}
                                className="platform-item"
                                onClick={() => handleSelectPlatform(platform)}
                              >
                                <div className="platform-icon-wrapper">
                                  <img
                                    src={platform.icon}
                                    alt={platform.name}
                                    className="platform-icon"
                                    style={{ backgroundColor: platform.color }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className="platform-info">
                                  <h4>{platform.name}</h4>
                                  <p>{platform.description}</p>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="platform-arrow">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                  toast.success('Link copied to clipboard!');
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
