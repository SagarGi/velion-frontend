import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiFileText, FiUser, FiCalendar } from 'react-icons/fi';

const ReviewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents/pending');
      setDocuments(response.data.documents);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load pending documents');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (documentId, status) => {
    try {
      await api.put(`/documents/${documentId}/review`, {
        status,
        comment: reviewComment
      });

      toast.success(`Document ${status} successfully!`);
      setReviewingId(null);
      setReviewComment('');
      fetchPendingDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status} document`);
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
          <h1 className="page-title">Review Documents</h1>
          <p className="page-subtitle">
            Pending documents waiting for approval ({documents.length})
          </p>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-2">
            {documents.map((doc) => (
              <div key={doc.id} className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="document-title">
                    <FiFileText style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
                    {doc.title}
                  </div>
                  
                  <span className="status-badge status-pending" style={{ marginTop: '0.5rem' }}>
                    Pending Review
                  </span>
                </div>

                {doc.description && (
                  <p style={{ color: 'var(--secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {doc.description}
                  </p>
                )}

                <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <FiUser size={14} />
                    Uploaded by: <strong>{doc.uploader_name}</strong> ({doc.uploader_email})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCalendar size={14} />
                    {new Date(doc.upload_date).toLocaleDateString()}
                  </div>
                </div>

                {doc.tags && (
                  <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {doc.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="tag tag-primary">{tag.trim()}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {doc.department && <span className="tag">{doc.department}</span>}
                  {doc.region && <span className="tag">{doc.region}</span>}
                  {doc.project_type && <span className="tag">{doc.project_type}</span>}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
                  File: {doc.file_name} ({(doc.file_size / 1024 / 1024).toFixed(2)} MB)
                </div>

                {reviewingId === doc.id ? (
                  <div>
                    <textarea
                      className="form-textarea"
                      placeholder="Add review comment (optional)..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows="3"
                      style={{ marginBottom: '0.75rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleReview(doc.id, 'approved')}
                        className="btn btn-success"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => handleReview(doc.id, 'rejected')}
                        className="btn btn-danger"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <FiXCircle /> Reject
                      </button>
                      <button
                        onClick={() => {
                          setReviewingId(null);
                          setReviewComment('');
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                      to={`/documents/${doc.id}`}
                      className="btn btn-outline"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setReviewingId(doc.id)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon"><FiCheckCircle /></div>
              <p className="empty-state-text">No pending documents to review</p>
              <p style={{ color: 'var(--secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                All documents have been reviewed. Great job!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDocuments;
