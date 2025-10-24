import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Link, UserProfile } from '../types';
import './UserPage.css';

export function UserPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [username]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, linksData] = await Promise.all([
        api.getProfile(),
        api.getLinks()
      ]);
      setProfile(profileData);
      setLinks(linksData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
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

  if (!profile) {
    return (
      <div className="user-page error">
        <h2>Profil bulunamadı</h2>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="container">
        {/* Admin Button */}
        <button 
          className="admin-btn"
          onClick={() => navigate(`/admin/${username}`)}
          title="Admin Paneli"
        >
          ⚙️
        </button>

        {/* Profile Section */}
        <div className="profile-section">
          <img 
            src={profile.avatar} 
            alt={profile.displayName}
            className="avatar"
          />
          <h1 className="display-name">{profile.displayName}</h1>
          <p className="bio">{profile.bio}</p>
        </div>

        {/* Links Section */}
        <div className="links-section">
          {links.length === 0 ? (
            <p className="no-links">Henüz link eklenmemiş</p>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                className="link-card"
                onClick={() => handleLinkClick(link.url)}
              >
                {link.icon && <span className="link-icon">{link.icon}</span>}
                <span className="link-title">{link.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

