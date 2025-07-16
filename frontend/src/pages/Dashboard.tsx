import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demo
  useEffect(() => {
    setTimeout(() => {
      const mockComplaints: Complaint[] = [
        {
          id: '1',
          title: 'Internet Connection Issues',
          description: 'Experiencing frequent disconnections with internet service',
          category: 'Technical',
          priority: 'high',
          status: 'in-progress',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z'
        },
        {
          id: '2',
          title: 'Billing Discrepancy',
          description: 'Incorrect charges on my monthly bill',
          category: 'Billing',
          priority: 'medium',
          status: 'pending',
          createdAt: '2024-01-14T09:15:00Z',
          updatedAt: '2024-01-14T09:15:00Z'
        },
        {
          id: '3',
          title: 'Service Installation Delay',
          description: 'Scheduled installation has been delayed multiple times',
          category: 'Service',
          priority: 'high',
          status: 'resolved',
          createdAt: '2024-01-12T16:45:00Z',
          updatedAt: '2024-01-18T11:30:00Z'
        },
        {
          id: '4',
          title: 'Customer Service Response',
          description: 'Poor response time from customer service team',
          category: 'Support',
          priority: 'low',
          status: 'closed',
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-01-15T17:00:00Z'
        }
      ];
      setComplaints(mockComplaints);
      setFilteredComplaints(mockComplaints);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-warning" />;
      case 'in-progress':
        return <AlertCircle size={16} className="text-primary" />;
      case 'resolved':
        return <CheckCircle size={16} className="text-success" />;
      case 'closed':
        return <XCircle size={16} className="text-secondary" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-pending';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  };

  const getStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;

    return { total, pending, inProgress, resolved };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar - Hidden on mobile, shown as horizontal on tablet/desktop */}
        <div className="col-12 col-md-3 col-lg-2 sidebar">
          <h5 className="mb-3">Dashboard</h5>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <Clock size={18} className="me-2" />
                My Complaints
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/submit-complaint">
                <Plus size={18} className="me-2" />
                New Complaint
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10">
          <div className="p-3 p-md-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <div>
                <h2 className="mb-1">Welcome back, {user?.name}!</h2>
                <p className="text-muted mb-0">Here's an overview of your complaints</p>
              </div>
              <Link to="/submit-complaint" className="btn btn-primary w-100 w-md-auto">
                <Plus size={18} className="me-2" />
                Submit New Complaint
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Total</h6>
                        <h4 className="mb-0">{stats.total}</h4>
                      </div>
                      <div>
                        <Clock size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Pending</h6>
                        <h4 className="mb-0">{stats.pending}</h4>
                      </div>
                      <div>
                        <AlertCircle size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">In Progress</h6>
                        <h4 className="mb-0">{stats.inProgress}</h4>
                      </div>
                      <div>
                        <Clock size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-1">Resolved</h6>
                        <h4 className="mb-0">{stats.resolved}</h4>
                      </div>
                      <div>
                        <CheckCircle size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Filter size={18} />
                      </span>
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">My Complaints ({filteredComplaints.length})</h5>
              </div>
              <div className="card-body p-0">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center p-5">
                    <p className="text-muted mb-0">No complaints found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th className="d-none d-md-table-cell">Category</th>
                          <th className="d-none d-lg-table-cell">Priority</th>
                          <th>Status</th>
                          <th className="d-none d-md-table-cell">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComplaints.map((complaint) => (
                          <tr key={complaint.id}>
                            <td>
                              <div>
                                <h6 className="mb-1">{complaint.title}</h6>
                                <small className="text-muted d-block d-md-none">
                                  {complaint.category} • {complaint.priority.toUpperCase()}
                                </small>
                                <small className="text-muted">
                                  {complaint.description.substring(0, 40)}...
                                </small>
                              </div>
                            </td>
                            <td className="d-none d-md-table-cell">
                              <span className="badge bg-light text-dark">
                                {complaint.category}
                              </span>
                            </td>
                            <td className="d-none d-lg-table-cell">
                              <span className={`fw-semibold ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                                {getStatusIcon(complaint.status)}
                                <span className="ms-1 d-none d-sm-inline">{complaint.status.replace('-', ' ')}</span>
                              </span>
                            </td>
                            <td className="d-none d-md-table-cell">
                              <small className="text-muted">
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </small>
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
    </div>
  );
};

export default Dashboard;