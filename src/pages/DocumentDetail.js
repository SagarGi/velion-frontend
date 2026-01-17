import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiDownload, FiTrash2, FiFileText, FiUser, FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';

const DocumentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await api.get(`/documents/${id}`);
      setDocument(response.data.document);
    } catch (error) {
      toast.error('Failed to load document');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Document downloaded successfully');
      fetchDocument(); // Refresh to update download count
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted successfully');
      navigate('/documents');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  const isOwner = user?.id === document.uploader_id;

  return (
    <div className="page">
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="card">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h1 className="page-title" style={{ marginBottom: 0 }}>
                    <FiFileText style={{ marginRight: '0.75rem', color: 'var(--primary)' }} />
                    {document.title}
                  </h1>
                  {document.status && (
                    <span className={`status-badge status-${document.status}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  )}
                </div>
                {document.description && (
                  <p style={{ color: 'var(--secondary)', fontSize: '1.125rem' }}>
                    {document.description}
                  </p>
                )}
                {document.status === 'rejected' && document.review_comment && (
                  <div className="alert alert-error" style={{ marginTop: '1rem' }}>
                    <strong>Rejection Reason:</strong> {document.review_comment}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button onClick={handleDownload} className="btn btn-primary">
                <FiDownload style={{ marginRight: '0.5rem' }} />
                Download Document
              </button>
              {isOwner && (
                <button onClick={handleDelete} className="btn btn-danger">
                  <FiTrash2 style={{ marginRight: '0.5rem' }} />
                  Delete
                </button>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                  UPLOADED BY
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiUser style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: '600' }}>{document.uploader_name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                      {document.uploader_email}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                  UPLOAD DATE
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCalendar style={{ color: 'var(--primary)' }} />
                  <span>{new Date(document.upload_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>

              {document.department && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                    DEPARTMENT
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiBriefcase style={{ color: 'var(--primary)' }} />
                    <span>{document.department}</span>
                  </div>
                </div>
              )}

              {document.region && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                    REGION
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMapPin style={{ color: 'var(--primary)' }} />
                    <span>{document.region}</span>
                  </div>
                </div>
              )}

              {document.reviewed_by && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                    REVIEWED BY
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiUser style={{ color: document.status === 'approved' ? 'var(--success)' : 'var(--danger)' }} />
                    <div>
                      <div style={{ fontWeight: '600' }}>{document.reviewer_name}</div>
                      {document.reviewed_at && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                          {new Date(document.reviewed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {document.tags && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                  TAGS
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {document.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="tag tag-primary">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              padding: '1.5rem', 
              background: 'var(--light)', 
              borderRadius: '0.5rem' 
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                  File Name
                </div>
                <div style={{ fontWeight: '600' }}>{document.file_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                  File Size
                </div>
                <div style={{ fontWeight: '600' }}>
                  {(document.file_size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                  Downloads
                </div>
                <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                  <FiDownload style={{ marginRight: '0.25rem' }} />
                  {document.download_count}
                </div>
              </div>
              {document.project_type && (
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                    Project Type
                  </div>
                  <div style={{ fontWeight: '600' }}>{document.project_type}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
