/**
 * Profile Edit Page - Profil Düzenleme/Oluşturma Sayfası
 * Kullanıcı ilk kez profil oluşturur veya mevcut profilini düzenler
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getUserProfiles, createProfileTransaction } from '../Utils/MoveCalls';
import { WalletConnect } from '../Components/WalletConnect';
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
        // Kullanıcının zaten profili var, admin paneline yönlendir
        navigate('/admin');
      }
    } catch (error) {
      console.error('Profil kontrol hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    // Validation
    if (formData.username.length < 3) {
      alert('Kullanıcı adı en az 3 karakter olmalı');
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
            alert('🎉 Profil oluşturuldu! Hoş geldin!');
            // Admin paneline yönlendir
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          },
          onError: (error) => {
            console.error('Transaction hatası:', error);
            alert('❌ Hata: ' + error.message);
            setProcessing(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Profil oluşturma hatası:', error);
      alert('Hata: ' + error.message);
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
        <h2>🔐 Lütfen cüzdanınızı bağlayın</h2>
        <button onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
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
            <h1>🎨 Profilini Oluştur</h1>
            <p>Blockchain'deki yerini al! Bilgilerini doldur ve başla.</p>
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
                placeholder="ahmet123"
                required
                minLength={3}
                maxLength={20}
                disabled={processing}
              />
              <small>3-20 karakter, sadece harf ve rakam (örn: ahmet123)</small>
            </div>

            {/* Display Name */}
            <div className="form-group">
              <label>
                <span className="label-icon">✨</span>
                Görünen İsim
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
              <small>Profilinde görünecek isim (örn: Ahmet Yılmaz)</small>
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
                placeholder="Tüm linklerim burada! 🚀"
                required
                maxLength={200}
                rows={4}
                disabled={processing}
              />
              <small>Kısa bir açıklama (maks. 200 karakter)</small>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <div className="info-icon">💡</div>
              <div className="info-text">
                <strong>Blockchain'de Kalıcı!</strong>
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
            <h2>{formData.display_name || 'İsminiz'}</h2>
            <p className="preview-bio">{formData.bio || 'Biyografiniz burada görünecek...'}</p>
            <span className="preview-username">@{formData.username || 'kullaniciadi'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

