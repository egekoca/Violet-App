import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Link, UserProfile } from '../types';
import './AdminPage.css';

export function AdminPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, linksData] = await Promise.all([
        api.getProfile(),
        api.getAllLinks()
      ]);
      setProfile(profileData);
      setLinks(linksData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addLink({
        ...formData,
        order: links.length + 1
      });
      setFormData({ title: '', url: '', icon: '', isActive: true });
      setShowAddForm(false);
      await loadData();
    } catch (error) {
      console.error('Link eklenirken hata:', error);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    try {
      await api.updateLink(editingLink.id, formData);
      setEditingLink(null);
      setFormData({ title: '', url: '', icon: '', isActive: true });
      await loadData();
    } catch (error) {
      console.error('Link güncellenirken hata:', error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Bu linki silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteLink(id);
      await loadData();
    } catch (error) {
      console.error('Link silinirken hata:', error);
    }
  };

  const startEdit = (link: Link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon || '',
      isActive: link.isActive
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingLink(null);
    setFormData({ title: '', url: '', icon: '', isActive: true });
  };

  const toggleLinkActive = async (link: Link) => {
    try {
      await api.updateLink(link.id, { isActive: !link.isActive });
      await loadData();
    } catch (error) {
      console.error('Link durumu değiştirilirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="admin-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <button 
            className="back-btn"
            onClick={() => navigate(`/${username}`)}
          >
            ← Profili Gör
          </button>
          <h1>Admin Paneli</h1>
        </div>

        {/* Profile Info */}
        {profile && (
          <div className="profile-info">
            <img src={profile.avatar} alt={profile.displayName} className="avatar-small" />
            <div>
              <h2>{profile.displayName}</h2>
              <p>@{profile.username}</p>
            </div>
          </div>
        )}

        {/* Add Link Button */}
        {!showAddForm && !editingLink && (
          <button 
            className="add-link-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Yeni Link Ekle
          </button>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingLink) && (
          <form 
            className="link-form" 
            onSubmit={editingLink ? handleUpdateLink : handleAddLink}
          >
            <h3>{editingLink ? 'Link Düzenle' : 'Yeni Link Ekle'}</h3>
            
            <div className="form-group">
              <label>Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Instagram"
                required
              />
            </div>

            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>İkon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📸"
                maxLength={2}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Aktif
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingLink ? 'Güncelle' : 'Ekle'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  cancelEdit();
                }}
              >
                İptal
              </button>
            </div>
          </form>
        )}

        {/* Links List */}
        <div className="links-list">
          <h3>Linkler ({links.length})</h3>
          {links.length === 0 ? (
            <p className="no-links">Henüz link eklenmemiş</p>
          ) : (
            links.map((link) => (
              <div 
                key={link.id} 
                className={`link-item ${!link.isActive ? 'inactive' : ''}`}
              >
                <div className="link-info">
                  {link.icon && <span className="link-icon">{link.icon}</span>}
                  <div className="link-details">
                    <h4>{link.title}</h4>
                    <p>{link.url}</p>
                  </div>
                </div>
                <div className="link-actions">
                  <button
                    className="toggle-btn"
                    onClick={() => toggleLinkActive(link)}
                    title={link.isActive ? 'Deaktif Et' : 'Aktif Et'}
                  >
                    {link.isActive ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(link)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

