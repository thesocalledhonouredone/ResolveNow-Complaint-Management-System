import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText } from 'lucide-react';

const NewComplaint: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/complaints', {
        title,
        description,
        priority,
      });
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <FileText size={24} className="me-2 text-primary" />
                <h4 className="mb-0">New Complaint</h4>
              </div>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Provide detailed information about the issue..."
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewComplaint;