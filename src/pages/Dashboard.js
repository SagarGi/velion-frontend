import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiFileText, FiDownload, FiTrendingUp, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, docsRes, leadersRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/documents/recent?limit=10'),
        api.get('/users/leaderboard?limit=3')
      ]);

      setStats(statsRes.data.stats);
      setRecentDocs(docsRes.data.documents || []);
      setTopContributors(leadersRes.data.leaderboard || []);
    } catch (error) {
      console.error('Dashboard data error:', error);
      toast.error('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
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
          <h1 className="page-title">Welcome back, {user?.name}!</h1>
          <p className="page-subtitle">Here's what's happening in your knowledge network</p>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{stats?.document_count || 0}</div>
            <div className="stat-label">
              <FiFileText style={{ display: 'inline', marginRight: '0.5rem' }} />
              Your Documents
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{stats?.total_downloads || 0}</div>
            <div className="stat-label">
              <FiDownload style={{ display: 'inline', marginRight: '0.5rem' }} />
              Total Downloads
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">#{stats?.rank || '-'}</div>
            <div className="stat-label">
              <FiTrendingUp style={{ display: 'inline', marginRight: '0.5rem' }} />
              Your Rank
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Recent Documents */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-header" style={{ marginBottom: 0 }}>Recent Documents</h2>
              <Link to="/documents" className="btn btn-outline">View All</Link>
            </div>

            {recentDocs.length > 0 ? (
              <div>
                {recentDocs.map((doc) => (
                  <div key={doc.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                    <Link to={`/documents/${doc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="document-title">{doc.title}</div>
                        {doc.status && (
                          <span className={`status-badge status-${doc.status}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginTop: '0.25rem' }}>
                        by {doc.uploader_name} • {new Date(doc.upload_date).toLocaleDateString()}
                      </div>
                      {doc.tags && (
                        <div style={{ marginTop: '0.5rem' }}>
                          {doc.tags.split(',').slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="tag" style={{ marginRight: '0.5rem' }}>{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><FiFileText /></div>
                <p className="empty-state-text">No documents yet</p>
                <Link to="/upload" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  <FiUpload style={{ marginRight: '0.5rem' }} />
                  Upload First Document
                </Link>
              </div>
            )}
          </div>

          {/* Top Contributors */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="card-header" style={{ marginBottom: 0 }}>Top Contributors</h2>
              <Link to="/leaderboard" className="btn btn-outline">Full Leaderboard</Link>
            </div>

            {topContributors.map((contributor, idx) => (
              <div key={contributor.id} className="leaderboard-item">
                <div className="rank">#{idx + 1}</div>
                <div className="user-info">
                  <div className="user-name">{contributor.name}</div>
                  <div className="user-role">{contributor.role} • {contributor.department}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                    {contributor.document_count} docs
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                    {contributor.total_downloads} downloads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-header">Quick Actions</h2>
          <div className="grid grid-3">
            <Link to="/upload" className="btn btn-primary">
              <FiUpload style={{ marginRight: '0.5rem' }} />
              Upload Document
            </Link>
            <Link to="/documents" className="btn btn-outline">
              <FiFileText style={{ marginRight: '0.5rem' }} />
              Browse Documents
            </Link>
            <Link to="/experts" className="btn btn-outline">
              Find Experts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
