import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Clock, Shield, BarChart3, Users, CheckCircle, ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Resolve Issues Faster with ResolveNow
              </h1>
              <p className="lead mb-4">
                A comprehensive complaint management system that streamlines issue resolution, 
                improves customer satisfaction, and provides real-time tracking.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {isAuthenticated ? (
                  <>
                    <Link to="/submit-complaint" className="btn btn-light btn-lg d-flex align-items-center">
                      <MessageSquare size={20} className="me-2" />
                      Submit Complaint
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-light btn-lg d-flex align-items-center">
                      <BarChart3 size={20} className="me-2" />
                      View Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg d-flex align-items-center">
                      Get Started
                      <ArrowRight size={20} className="ms-2" />
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg d-flex align-items-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {isAuthenticated && (
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded">
                  <p className="mb-0 text-light">
                    <strong>Welcome back, {user?.name}!</strong> 
                    {user?.role === 'admin' ? ' You have admin access.' : ' Ready to manage your complaints?'}
                  </p>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="feature-icon bg-light text-primary mx-auto" style={{ width: '200px', height: '200px', fontSize: '4rem' }}>
                  <MessageSquare size={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section for Authenticated Users */}
      {isAuthenticated && (
        <section className="py-4 bg-primary bg-opacity-10">
          <div className="container">
            <div className="row g-3">
              <div className="col-md-4">
                <Link to="/dashboard" className="card h-100 text-decoration-none">
                  <div className="card-body text-center">
                    <BarChart3 size={32} className="text-primary mb-2" />
                    <h6 className="card-title">Dashboard</h6>
                    <small className="text-muted">View your complaints</small>
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/submit-complaint" className="card h-100 text-decoration-none">
                  <div className="card-body text-center">
                    <MessageSquare size={32} className="text-success mb-2" />
                    <h6 className="card-title">New Complaint</h6>
                    <small className="text-muted">Submit an issue</small>
                  </div>
                </Link>
              </div>
              {user?.role === 'admin' && (
                <div className="col-md-4">
                  <Link to="/admin" className="card h-100 text-decoration-none">
                    <div className="card-body text-center">
                      <Shield size={32} className="text-warning mb-2" />
                      <h6 className="card-title">Admin Panel</h6>
                      <small className="text-muted">Manage all complaints</small>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">Why Choose ResolveNow?</h2>
              <p className="lead text-muted">
                Our platform offers comprehensive tools to manage, track, and resolve complaints efficiently.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <Clock size={30} color="white" />
                </div>
                <h4 className="mb-3">Real-time Tracking</h4>
                <p className="text-muted">
                  Track your complaints in real-time with instant status updates and notifications.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <Shield size={30} color="white" />
                </div>
                <h4 className="mb-3">Secure & Private</h4>
                <p className="text-muted">
                  Your data is protected with enterprise-grade security and privacy measures.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <BarChart3 size={30} color="white" />
                </div>
                <h4 className="mb-3">Analytics Dashboard</h4>
                <p className="text-muted">
                  Comprehensive analytics and reporting for better decision making.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <Users size={30} color="white" />
                </div>
                <h4 className="mb-3">Multi-user Support</h4>
                <p className="text-muted">
                  Support for multiple users with role-based access control.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <CheckCircle size={30} color="white" />
                </div>
                <h4 className="mb-3">Easy Resolution</h4>
                <p className="text-muted">
                  Streamlined workflow for quick and efficient complaint resolution.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 text-center p-4 border-0 shadow-sm">
                <div className="feature-icon">
                  <MessageSquare size={30} color="white" />
                </div>
                <h4 className="mb-3">Communication Hub</h4>
                <p className="text-muted">
                  Centralized communication between customers and support teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="stats-card">
                <div className="stats-number text-primary">1,000+</div>
                <div className="text-muted">Complaints Resolved</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stats-card">
                <div className="stats-number text-success">98%</div>
                <div className="text-muted">Customer Satisfaction</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stats-card">
                <div className="stats-number text-warning">24h</div>
                <div className="text-muted">Average Response Time</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="stats-card">
                <div className="stats-number text-info">500+</div>
                <div className="text-muted">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-5 bg-primary text-white">
          <div className="container text-center">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2 className="display-6 fw-bold mb-3">Ready to Get Started?</h2>
                <p className="lead mb-4">
                  Join thousands of satisfied customers who trust ResolveNow for their complaint management needs.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/register" className="btn btn-light btn-lg d-flex align-items-center">
                    Create Free Account
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;