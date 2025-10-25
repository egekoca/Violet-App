import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getUserProfiles, getProfileByUsername } from '../lib/blockchain';
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

  useEffect(() => {
    loadData();
  }, [account, username]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // If the URL has an username, display the PUBLIC profile
      if (username) {
        console.log('🌐 Public profile mode - Target username:', username);
        const publicProfile = await getProfileByUsername(username);
        
        if (publicProfile) {
          setProfile(publicProfile);
        } else {
          setError(`User @${username} not found`);
          setProfile(null);
        }
        return;
      }

      // If there is no username in the URL, show the logged in user's profile
      if (!account) {
        setError('Please connect your wallet to view your profile');
        setProfile(null);
        return;
      }

      // Fetch all the profile data
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

  if (loading) {
    return (
      <div className="user-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // If the username is provided (public profile), no wallet connection required
  if (!account && !username) {
    return (
      <div className="user-page error">
        <div className="container">
          <h2>Wallet Connection Is Required</h2>
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
          <h2>{error}</h2>
          {error.includes('No profile') && (
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

        {/* Admin Button - Show it only in your profile */}
        {!username && account && profile && profile.owner === account.address && (
          <button 
            className="admin-btn"
            onClick={() => navigate('/admin')}
            title="Admin Page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 3V5M12 19V21M3 12H5M19 12H21M6.34315 6.34315L7.75736 7.75736M16.2426 16.2426L17.6569 17.6569M6.34315 17.6569L7.75736 16.2426M16.2426 7.75736L17.6569 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

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
          <p>Powered by <a href="https://sui.io/" target='_blank' rel='noopener noreferrer' className="blue-link">Sui Blockchain</a></p>
        </footer>
      </div>
    </div>
  );
}

