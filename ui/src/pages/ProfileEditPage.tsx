/**
 * Profile Edit Page - For Profile Creating/Editing
 * The user either creates a profile or edits an existing one
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, createProfileTransaction } from '../lib/blockchain';
import { WalletConnect } from '../components/WalletConnect';
import './ProfileEditPage.css';

export function ProfileEditPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
  });

  useEffect(() => {
    checkProfile();
  }, [account]);

  const checkProfile = async () => {
    if (!account) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const profiles = await getUserProfiles(account.address);
      
      if (profiles.length > 0) {
        // The user already has an account, redirect to the admin page
        navigate('/admin');
      }
    } catch (error) {
      console.error('Profile control error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    // Validation
    if (formData.username.length < 3) {
      alert('The username must consist of at least 3 characters');
      return;
    }

    try {
      setProcessing(true);
      const tx = createProfileTransaction(formData);

      signAndExecute(
        { 
          transaction: tx as any,
        },
        {
          onSuccess: async () => {
            alert('🎉 Account succesfully created. Welcome!');
            // Admin paneline yönlendir
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            alert('❌ Error: ' + error.message);
            setProcessing(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Profile create error:', error);
      alert('Error: ' + error.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-edit-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="profile-edit-page error">
        <h2>🔐 Please connect to your wallet</h2>
        <button onClick={() => navigate('/')}>Back to Homepage</button>
      </div>
    );
  }

  return (
    <div className="profile-edit-page">
      {/* Header */}
      <div className="edit-header">
        <div className="logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">VIOLET</span>
        </div>
        <WalletConnect />
      </div>

      {/* Main Content */}
      <div className="edit-container">
        <div className="edit-card">
          <div className="card-header">
            <h1>🎨 Create Your Profile</h1>
            <p>Take your new place on the blockchain! Fill in your details and start right now.</p>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            {/* Username */}
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                placeholder="johndoe123"
                required
                minLength={3}
                maxLength={20}
                disabled={processing}
              />
              <small>Between 3-20 characters, only letters and numbers (ex: johndoe123)</small>
            </div>

            {/* Display Name */}
            <div className="form-group">
              <label>
                <span className="label-icon">✨</span>
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="John Doe"
                required
                maxLength={50}
                disabled={processing}
              />
              <small>The display name to show in your profile (ex: John Doe)</small>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label>
                <span className="label-icon">📝</span>
                Biography
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="All my links are here!"
                required
                maxLength={200}
                rows={4}
                disabled={processing}
              />
              <small>A short description. (max 200 characters)</small>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <div className="info-icon">💡</div>
              <div className="info-text">
                <strong>Persistent on Blockchain!</strong>
                <p>These infos will be kept on the Sui blockchain and will be yours, forever.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner-small"></span>
                  Creating the profile...
                </>
              ) : (
                <>
                  Create Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Card */}
        <div className="preview-card">
          <h3>Preview</h3>
          <div className="preview-content">
            <div className="preview-avatar">
              {formData.username ? formData.username.charAt(0).toUpperCase() : '?'}
            </div>
            <h2>{formData.display_name || 'Your Name'}</h2>
            <p className="preview-bio">{formData.bio || 'Your biography is here..'}</p>
            <span className="preview-username">@{formData.username || 'username'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

