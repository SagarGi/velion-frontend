import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiFileText, FiDownload, FiCalendar, FiUser } from 'react-icons/fi';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    region: '',
    tags: ''
  });
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetchDocuments();
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [deptRes, regionRes] = await Promise.all([
        api.get('/users/departments'),
        api.get('/users/regions')
      ]);
      setDepartments(deptRes.data.departments);
      setRegions(regionRes.data.regions);
    } catch (error) {
      console.error('Failed to load filter options');
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.region) params.append('region', filters.region);
      if (filters.tags) params.append('tags', filters.tags);

      const response = await api.get(`/documents?${params.toString()}`);
      setDocuments(response.data.documents);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({ search: '', department: '', region: '', tags: '' });
    setTimeout(() => fetchDocuments(), 100);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Document Repository</h1>
          <p className="page-subtitle">Browse and search all knowledge resources</p>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search documents by title, description, or tags..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div className="filters">
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <input
                type="text"
                className="form-input"
                placeholder="Filter by tag..."
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
              />

              <button type="submit" className="btn btn-primary">
                <FiFilter style={{ marginRight: '0.5rem' }} />
                Apply
              </button>

              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-2">
            {documents.map((doc) => (
              <Link 
                key={doc.id} 
                to={`/documents/${doc.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="document-card">
                  <div className="document-title">
                    <FiFileText style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                    {doc.title}
                  </div>

                  {doc.status && (
                    <span className={`status-badge status-${doc.status}`} style={{ marginLeft: '0.5rem' }}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  )}
                  
                  {doc.description && (
                    <p style={{ color: 'var(--secondary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      {doc.description.substring(0, 120)}{doc.description.length > 120 ? '...' : ''}
                    </p>
                  )}

                  <div className="document-meta">
                    <span className="tag">
                      <FiUser style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                      {doc.uploader_name}
                    </span>
                    <span className="tag">
                      <FiCalendar style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </span>
                    <span className="tag">
                      <FiDownload style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                      {doc.download_count} downloads
                    </span>
                  </div>

                  {doc.tags && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {doc.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="tag tag-primary">{tag.trim()}</span>
                      ))}
                    </div>
                  )}

                  {(doc.department || doc.region) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      {doc.department && <span className="tag">{doc.department}</span>}
                      {doc.region && <span className="tag">{doc.region}</span>}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon"><FiFileText /></div>
              <p className="empty-state-text">No documents found</p>
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && documents.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--secondary)' }}>
            Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
