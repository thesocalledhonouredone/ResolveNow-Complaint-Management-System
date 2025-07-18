import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Plus, Eye, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [engineers, setEngineers] = useState<any[]>([]);

  useEffect(() => {
    fetchComplaints();
    if (user?.role === 'admin') {
      fetchEngineers();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEngineers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/engineers');
      setEngineers(response.data);
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  const assignComplaint = async (complaintId: string, engineerId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
        engineerId,
      });
      fetchComplaints();
    } catch (error) {
      console.error('Error assigning complaint:', error);
    }
  };

  const updateStatus = async (complaintId: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${complaintId}/status`, {
        status,
      });
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
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

  const filteredComplaints = complaints.filter(complaint => {
    if (user?.role === 'user') {
      return complaint.createdBy.email === user.email;
    }
    if (user?.role === 'engineer') {
      return complaint.assignedTo?.email === user.email;
    }
    return true; // admin sees all
  });

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

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>ResolveNow Dashboard</h2>
              <p className="text-muted mb-0">
                Welcome back, {user?.name} ({user?.role})
              </p>
            </div>
            {user?.role === 'user' && (
              <Link to="/new-complaint" className="btn btn-primary">
                <Plus size={16} className="me-2" />
                New Complaint
              </Link>
            )}
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Clock size={24} className="me-3" />
                    <div>
                      <h5 className="card-title mb-0">
                        {filteredComplaints.filter(c => c.status === 'pending').length}
                      </h5>
                      <small>Pending</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Users size={24} className="me-3" />
                    <div>
                      <h5 className="card-title mb-0">
                        {filteredComplaints.filter(c => c.status === 'assigned').length}
                      </h5>
                      <small>Assigned</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <AlertCircle size={24} className="me-3" />
                    <div>
                      <h5 className="card-title mb-0">
                        {filteredComplaints.filter(c => c.status === 'in-progress').length}
                      </h5>
                      <small>In Progress</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <CheckCircle size={24} className="me-3" />
                    <div>
                      <h5 className="card-title mb-0">
                        {filteredComplaints.filter(c => c.status === 'resolved').length}
                      </h5>
                      <small>Resolved</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {user?.role === 'user' ? 'My Complaints' : 
                 user?.role === 'engineer' ? 'Assigned Complaints' : 'All Complaints'}
              </h5>
            </div>
            <div className="card-body">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No complaints found.</p>
                  {user?.role === 'user' && (
                    <Link to="/new-complaint" className="btn btn-primary">
                      Create Your First Complaint
                    </Link>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        {user?.role !== 'user' && <th>Created By</th>}
                        {user?.role === 'admin' && <th>Assigned To</th>}
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td>
                            <strong>{complaint.title}</strong>
                            <br />
                            <small className="text-muted">
                              {complaint.description.substring(0, 100)}...
                            </small>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(complaint.status)}`}>
                              {complaint.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadge(complaint.priority)}`}>
                              {complaint.priority.toUpperCase()}
                            </span>
                          </td>
                          {user?.role !== 'user' && (
                            <td>{complaint.createdBy.name}</td>
                          )}
                          {user?.role === 'admin' && (
                            <td>
                              {complaint.assignedTo ? (
                                complaint.assignedTo.name
                              ) : (
                                <div className="d-flex gap-2">
                                  <select
                                    className="form-select form-select-sm"
                                    value={selectedEngineer}
                                    onChange={(e) => setSelectedEngineer(e.target.value)}
                                  >
                                    <option value="">Select Engineer</option>
                                    {engineers.map((engineer) => (
                                      <option key={engineer._id} value={engineer._id}>
                                        {engineer.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      if (selectedEngineer) {
                                        assignComplaint(complaint._id, selectedEngineer);
                                        setSelectedEngineer('');
                                      }
                                    }}
                                  >
                                    Assign
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                          <td>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                to={`/complaint/${complaint._id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <Eye size={14} />
                              </Link>
                              {user?.role === 'engineer' && complaint.assignedTo?.email === user.email && (
                                <select
                                  className="form-select form-select-sm"
                                  value={complaint.status}
                                  onChange={(e) => updateStatus(complaint._id, e.target.value)}
                                >
                                  <option value="assigned">Assigned</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;