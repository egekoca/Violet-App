/**
 * Profile Edit Page
 * Create the new user profile if it's the first time - Otherwise edit the existing profile
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, createProfileTransaction } from '../Utils/MoveCalls';
import { WalletConnect } from '../Components/WalletConnect';
import toast from 'react-hot-toast';
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
    image_url: '',
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
        // The user already has an account, redirect to the /admin
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
      toast.error('The username must have at least 3 characters');
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
            toast.success('The profile has been created. Welcome!');
            // Redirect to the admin dashboard
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            toast.error('Transaction Error: ' + error.message);
            setProcessing(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil creating error:', error);
      toast.error('Profile Creating Error: ' + error.message);
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
        <h2>🔐 Please Connect Your Wallet</h2>
        <button onClick={() => navigate('/')}>Back to Homepage</button>
      </div>
    );
  }

  return (
    <div className="profile-edit-page">
      {/* Header */}
      <div className="edit-header">
        <div className="logo">
          <span className="logo-text">VIOLET</span>
        </div>
        <WalletConnect />
      </div>

      {/* Main Content */}
      <div className="edit-container">
        <div className="edit-card">
          <div className="card-header">
            <h1>🎨 Create A Profile</h1>
            <p>Take a place in the blockchain today! Sign in and start using it immediately.</p>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            {/* Username */}
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Kullanıcı Adı
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
              <small>Between 3-20 charachters, only letters and rumbers (ex: jphndoe123456789)</small>
            </div>

            {/* Display Name */}
            <div className="form-group">
              <label>
                <span className="label-icon">✨</span>
                Diplay Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Ahmet Yılmaz"
                required
                maxLength={50}
                disabled={processing}
              />
              <small>The name who will appear in your profile (ex: Janet Doe)</small>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label>
                <span className="label-icon">📝</span>
                Biyografi
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="All of my links are here, up and running!! 🚀"
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
                <strong>Permanent on Blockchain!</strong>
                <p>These informations will be forever yours.</p>
                <p>Bu bilgiler Sui blockchain'de saklanacak ve sonsuza dek sizin olacak.</p>
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
                  Profil Oluşturuluyor...
                </>
              ) : (
                <>
                  🎉 Profili Oluştur
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Card */}
        <div className="preview-card">
          <h3>📱 Önizleme</h3>
          <div className="preview-content">
            <div className="preview-avatar">
              {formData.username ? formData.username.charAt(0).toUpperCase() : '?'}
            </div>
            <h2>{formData.display_name || 'Name'}</h2>
            <p className="preview-bio">{formData.bio || 'Your biography will be seen here...'}</p>
            <span className="preview-username">@{formData.username || 'kullaniciadi (Aynı Formatta)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

