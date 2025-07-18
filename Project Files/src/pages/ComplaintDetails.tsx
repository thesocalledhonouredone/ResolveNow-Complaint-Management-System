import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeft, Calendar, User, AlertTriangle } from 'lucide-react';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/complaints/${id}`);
      setComplaint(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch complaint');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, {
        status,
      });
      fetchComplaint();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-warning text-dark',
      assigned: 'bg-info',
      'in-progress': 'bg-primary',
      resolved: 'bg-success',
    };
    return badges[status as keyof typeof badges] || 'bg-secondary';
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: 'bg-success',
      medium: 'bg-warning text-dark',
      high: 'bg-danger',
    };
    return badges[priority as keyof typeof badges] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Complaint not found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} className="me-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Dashboard
          </button>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="mb-2">{complaint.title}</h4>
                  <div className="d-flex gap-2">
                    <span className={`badge ${getStatusBadge(complaint.status)}`}>
                      {complaint.status.toUpperCase()}
                    </span>
                    <span className={`badge ${getPriorityBadge(complaint.priority)}`}>
                      {complaint.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {user?.role === 'engineer' && complaint.assignedTo?.email === user.email && (
                  <div>
                    <select
                      className="form-select"
                      value={complaint.status}
                      onChange={(e) => updateStatus(e.target.value)}
                    >
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <User size={16} className="me-2 text-muted" />
                    <strong>Created By:</strong>
                    <span className="ms-2">{complaint.createdBy.name}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={16} className="me-2 text-muted" />
                    <strong>Created:</strong>
                    <span className="ms-2">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  {complaint.assignedTo && (
                    <div className="d-flex align-items-center mb-2">
                      <User size={16} className="me-2 text-muted" />
                      <strong>Assigned To:</strong>
                      <span className="ms-2">{complaint.assignedTo.name}</span>
                    </div>
                  )}
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={16} className="me-2 text-muted" />
                    <strong>Last Updated:</strong>
                    <span className="ms-2">
                      {new Date(complaint.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h5>Description</h5>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {complaint.description}
                  </p>
                </div>
              </div>

              {complaint.priority === 'high' && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                  <AlertTriangle size={20} className="me-2" />
                  This is a high priority complaint and requires immediate attention.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;