import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiAward, FiTrendingUp, FiFileText, FiDownload } from 'react-icons/fi';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard?limit=20');
      setLeaders(response.data.leaderboard);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    const medals = {
      1: '🥇',
      2: '🥈',
      3: '🥉'
    };
    return medals[rank] || null;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FiAward style={{ marginRight: '0.75rem', color: 'var(--primary)' }} />
            Knowledge Contributors Leaderboard
          </h1>
          <p className="page-subtitle">Top contributors to our knowledge network</p>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 && (
          <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
            {/* Second Place */}
            <div className="card" style={{ textAlign: 'center', order: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥈</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {leaders[1].name}
              </h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {leaders[1].role}
              </p>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{leaders[1].document_count}</div>
              <div className="stat-label">Documents</div>
              <div style={{ marginTop: '0.5rem', color: 'var(--secondary)' }}>
                {leaders[1].total_downloads} downloads
              </div>
            </div>

            {/* First Place */}
            <div className="card" style={{ 
              textAlign: 'center', 
              order: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🥇</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {leaders[0].name}
              </h3>
              <p style={{ opacity: 0.9, fontSize: '0.875rem', marginBottom: '1rem' }}>
                {leaders[0].role}
              </p>
              <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {leaders[0].document_count}
              </div>
              <div style={{ opacity: 0.9 }}>Documents</div>
              <div style={{ marginTop: '0.5rem', opacity: 0.9 }}>
                {leaders[0].total_downloads} downloads
              </div>
            </div>

            {/* Third Place */}
            <div className="card" style={{ textAlign: 'center', order: 2 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥉</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {leaders[2].name}
              </h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {leaders[2].role}
              </p>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{leaders[2].document_count}</div>
              <div className="stat-label">Documents</div>
              <div style={{ marginTop: '0.5rem', color: 'var(--secondary)' }}>
                {leaders[2].total_downloads} downloads
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="card">
          <h2 className="card-header">Full Rankings</h2>
          
          {leaders.map((leader, idx) => (
            <div key={leader.id} className="leaderboard-item">
              <div className="rank">
                {getMedalIcon(idx + 1) || `#${idx + 1}`}
              </div>

              <div className="user-info">
                <div className="user-name">{leader.name}</div>
                <div className="user-role">
                  {leader.role} • {leader.department} • {leader.region}
                </div>
                {leader.expertise && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                    Expertise: {leader.expertise}
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                alignItems: 'center',
                textAlign: 'center' 
              }}>
                <div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <FiFileText size={20} />
                    {leader.document_count}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                    Documents
                  </div>
                </div>

                <div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <FiDownload size={18} />
                    {leader.total_downloads}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                    Downloads
                  </div>
                </div>
              </div>
            </div>
          ))}

          {leaders.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><FiTrendingUp /></div>
              <p className="empty-state-text">No contributors yet</p>
            </div>
          )}
        </div>

        {/* Motivation Message */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Want to climb the leaderboard?
          </h3>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            Share your knowledge by uploading valuable documents and helping your colleagues succeed!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
