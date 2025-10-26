import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletConnect } from '../Components/WalletConnect';
import { sponsoredBlockchain } from '../Utils/MoveCalls';
import { UserProfile } from '../Utils/Types';
import './LeaderboardPage.css';

export function LeaderboardPage() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const [users, setUsers] = useState<(UserProfile & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'region' | 'national' | 'global'>('global');
  
  const usersPerPage = 10;

  useEffect(() => {
    loadLeaderboard();
  }, [currentPage, selectedFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      console.log('🏆 Leaderboard loading...', { currentPage, usersPerPage });
      
      // Fetch real data from the blockchain
      const result = await sponsoredBlockchain.getLeaderboard(currentPage, usersPerPage);
      
      console.log('Leaderboard data has been loaded:', result);
      
      // Get XP from localStorage for all users
      const usersWithXp = result.users.map(user => {
        const xpKey = `user_xp_${user.id}`;
        const xp = parseInt(localStorage.getItem(xpKey) || '0');
        return {
          ...user,
          total_xp: xp,
          rank: 1,
        };
      });
      
      // Sort by XP
      usersWithXp.sort((a, b) => b.total_xp - a.total_xp);
      
      // Update Ranks
      usersWithXp.forEach((user, index) => {
          user.rank = index + 1;
      });
      
      setUsers(usersWithXp);
      setTotalPages(result.totalPages);
      
    } catch (error) {
      console.error('Leaderboard load error:', error);
      
      // Show empty list when error
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return '#ffffff';
  };

  const getTopThreeUsers = () => {
    return users.slice(0, 3);
  };

  const getOtherUsers = () => {
    return users.slice(3);
  };

  const isCurrentUser = (user: UserProfile & { rank: number }) => {
    return account && user.owner === account.address;
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <header className="leaderboard-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h1 className="page-title">Leaderboard</h1>
          
          <div className="header-actions">
            <div className="wallet-connect">
              <WalletConnect />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${selectedFilter === 'region' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('region')}
          >
            Region
          </button>
          <button 
            className={`filter-tab ${selectedFilter === 'national' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('national')}
          >
            National
          </button>
          <button 
            className={`filter-tab ${selectedFilter === 'global' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('global')}
          >
            Global
          </button>
        </div>
      </header>

      {/* Top 3 Podium */}
      <div className="podium-section">
        <div className="podium-container">
          {getTopThreeUsers().map((user, index) => (
            <div 
              key={user.id} 
              className={`podium-user ${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}`}
              onClick={() => navigate(`/${user.username}`)}
              style={{ cursor: 'pointer' }}
              title={`${user.display_name} profilini görüntüle`}
            >
              <div className="podium-rank">
                <span className="rank-number">{user.rank}</span>
                <div className="rank-crown">
                  {user.rank === 1 && <span className="crown">👑</span>}
                </div>
              </div>
              
              <div className="podium-avatar">
                <img 
                  src={user.image_url} 
                  alt={user.display_name}
                  className="avatar-image"
                />
                <div className="avatar-glow" style={{ backgroundColor: getRankColor(user.rank) + '20' }}></div>
              </div>
              
              <div className="podium-info">
                <h3 className="podium-name">{user.display_name}</h3>
                <p className="podium-username">@{user.username}</p>
                <div className="podium-xp" style={{ color: getRankColor(user.rank) }}>
                  {user.total_xp ? user.total_xp.toLocaleString() : 0} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Users List */}
      <div className="users-list-section">
        <div className="users-list">
          {getOtherUsers().map((user) => (
            <div 
              key={user.id} 
              className={`user-item ${isCurrentUser(user) ? 'current-user' : ''}`}
              onClick={() => navigate(`/${user.username}`)}
              style={{ cursor: 'pointer' }}
              title={`${user.display_name} view profile`}
            >
              <div className="user-rank">
                <span className="rank-number">{user.rank}</span>
              </div>
              
              <div className="user-avatar">
                <img 
                  src={user.image_url} 
                  alt={user.display_name}
                  className="avatar-image"
                />
              </div>
              
              <div className="user-info">
                <h4 className="user-name">{user.display_name}</h4>
                <p className="user-username">@{user.username}</p>
              </div>
              
              <div className="user-xp">
                <span className="xp-amount">{user.total_xp ? user.total_xp.toLocaleString() : 0}</span>
                <span className="xp-label">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="pagination-info">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
