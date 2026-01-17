import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUpload, FiFile } from 'react-icons/fi';

const UploadDocument = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    department: '',
    region: '',
    project_type: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departments = ['IT', 'Consulting', 'Logistics', 'Renewable Energy', 'Manufacturing', 'Operations'];
  const regions = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];
  const projectTypes = ['Client Deliverable', 'Internal Framework', 'Research Report', 'Technical Documentation', 'Best Practices'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('tags', formData.tags);
      uploadData.append('department', formData.department);
      uploadData.append('region', formData.region);
      uploadData.append('project_type', formData.project_type);

      await api.post('/documents/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Document uploaded successfully!');
      navigate('/documents');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Upload Document</h1>
          <p className="page-subtitle">Share your knowledge with the team</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Document Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Q4 Digital Transformation Strategy"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Brief description of the document content..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">File *</label>
                <div 
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {file ? (
                    <div>
                      <FiFile style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }} />
                      <p style={{ fontWeight: '600' }}>{file.name}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <FiUpload style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1rem' }} />
                      <p>Click to select a file or drag and drop</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                        PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., cloud, migration, aws, architecture"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select
                    className="form-select"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="">Select Region</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Type</label>
                <select
                  className="form-select"
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                >
                  <option value="">Select Project Type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/documents')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
