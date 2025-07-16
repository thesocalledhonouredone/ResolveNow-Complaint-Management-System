import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, Tag, Upload } from 'lucide-react';

const SubmitComplaint: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Technical Support',
    'Billing & Payment',
    'Service Quality',
    'Product Defect',
    'Delivery Issue',
    'Customer Service',
    'Account Management',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body p-5">
                <div className="text-success mb-3">
                  <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </div>
                <h3 className="text-success mb-3">Complaint Submitted Successfully!</h3>
                <p className="text-muted mb-3">
                  Your complaint has been received and assigned a tracking ID. 
                  You'll receive updates via email and can track progress in your dashboard.
                </p>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Redirecting...</span>
                </div>
                <p className="text-muted mt-2">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card complaint-form">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Submit New Complaint</h2>
                <p className="text-muted">
                  Provide detailed information about your issue for faster resolution
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label htmlFor="title" className="form-label">
                      <FileText size={18} className="me-1" />
                      Complaint Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="priority" className="form-label">
                      <AlertTriangle size={18} className="me-1" />
                      Priority *
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    <Tag size={18} className="me-1" />
                    Category *
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Detailed Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide a detailed description of your issue, including any relevant information that might help us resolve it faster..."
                    required
                  ></textarea>
                  <div className="form-text">
                    Minimum 20 characters. Be as specific as possible for better assistance.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="attachments" className="form-label">
                    <Upload size={18} className="me-1" />
                    Attachments (Optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="attachments"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />
                  <div className="form-text">
                    Supported formats: JPG, PNG, PDF, DOC, DOCX. Max 10MB per file.
                  </div>
                </div>

                <div className="alert alert-info" role="alert">
                  <strong>What happens next?</strong>
                  <ul className="mb-0 mt-2">
                    <li>You'll receive a confirmation email with your complaint ID</li>
                    <li>Our team will review and assign your complaint within 24 hours</li>
                    <li>You can track progress in your dashboard</li>
                    <li>Updates will be sent via email and system notifications</li>
                  </ul>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex-fill py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText size={18} className="me-2" />
                        Submit Complaint
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
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

export default SubmitComplaint;