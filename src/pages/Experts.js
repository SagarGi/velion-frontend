import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiSearch, FiUsers, FiMail, FiBriefcase, FiMapPin, FiFileText } from 'react-icons/fi';

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    region: '',
    expertise: ''
  });
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetchExperts();
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

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.region) params.append('region', filters.region);
      if (filters.expertise) params.append('expertise', filters.expertise);

      const response = await api.get(`/users/experts?${params.toString()}`);
      setExperts(response.data.experts);
    } catch (error) {
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExperts();
  };

  const clearFilters = () => {
    setFilters({ search: '', department: '', region: '', expertise: '' });
    setTimeout(() => fetchExperts(), 100);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FiUsers style={{ marginRight: '0.75rem', color: 'var(--primary)' }} />
            Expert Directory
          </h1>
          <p className="page-subtitle">Find colleagues with specific expertise</p>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--secondary)' 
                }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name or expertise..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <div className="filters">
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <input
                type="text"
                className="form-input"
                placeholder="Filter by expertise..."
                value={filters.expertise}
                onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
              />

              <button type="submit" className="btn btn-primary">
                Apply
              </button>

              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Experts Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-2">
            {experts.map((expert) => (
              <div key={expert.id} className="card" style={{ 
                transition: 'all 0.3s',
                cursor: 'default'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      marginBottom: '0.25rem',
                      color: 'var(--dark)'
                    }}>
                      {expert.name}
                    </h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                      {expert.role}
                    </p>
                  </div>
                  
                  {expert.document_count > 0 && (
                    <div style={{ 
                      background: 'var(--light)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: 'var(--primary)' 
                      }}>
                        {expert.document_count}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--secondary)' 
                      }}>
                        docs
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {expert.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiMail style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      <a 
                        href={`mailto:${expert.email}`} 
                        style={{ 
                          color: 'var(--primary)', 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                      >
                        {expert.email}
                      </a>
                    </div>
                  )}

                  {expert.department && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiBriefcase style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                        {expert.department}
                      </span>
                    </div>
                  )}

                  {expert.region && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiMapPin style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                        {expert.region}
                      </span>
                    </div>
                  )}
                </div>

                {expert.expertise && (
                  <div>
                    <h4 style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      color: 'var(--secondary)', 
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Expertise
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {expert.expertise.split(',').map((skill, idx) => (
                        <span key={idx} className="tag tag-primary">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon"><FiUsers /></div>
              <p className="empty-state-text">No experts found</p>
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && experts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--secondary)' }}>
            Showing {experts.length} expert{experts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Experts;
