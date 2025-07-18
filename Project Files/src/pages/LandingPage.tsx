import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  Zap, 
  BarChart3, 
  ArrowRight,
  Star,
  MessageSquare,
  Settings,
  Award
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3 text-primary" to="/">
            ResolveNow
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">Testimonials</a>
              </li>
              <li className="nav-item ms-2">
                <Link className="btn btn-outline-primary me-2" to="/login">
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary" to="/register">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold text-dark mb-4">
                  Streamline Your <span className="text-primary">Complaint Management</span> Process
                </h1>
                <p className="lead text-muted mb-4">
                  ResolveNow transforms how organizations handle complaints with intelligent 
                  assignment, real-time tracking, and seamless collaboration between users, 
                  administrators, and engineers.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/register" className="btn btn-primary btn-lg px-4">
                    Get Started Free
                    <ArrowRight size={20} className="ms-2" />
                  </Link>
                  <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
                    Sign In
                  </Link>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <CheckCircle size={16} className="text-success me-2" />
                  <small>100% Free • No hidden costs • Open source</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="dashboard-preview bg-white rounded-3 shadow-lg p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 text-primary">ResolveNow Dashboard</h6>
                    <div className="d-flex gap-1">
                      <div className="bg-danger rounded-circle" style={{width: '8px', height: '8px'}}></div>
                      <div className="bg-warning rounded-circle" style={{width: '8px', height: '8px'}}></div>
                      <div className="bg-success rounded-circle" style={{width: '8px', height: '8px'}}></div>
                    </div>
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-3">
                      <div className="bg-primary bg-opacity-10 rounded p-2 text-center">
                        <Clock size={16} className="text-primary mb-1" />
                        <div className="small fw-bold">24</div>
                        <div className="small text-muted">Pending</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="bg-info bg-opacity-10 rounded p-2 text-center">
                        <Users size={16} className="text-info mb-1" />
                        <div className="small fw-bold">12</div>
                        <div className="small text-muted">Assigned</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="bg-warning bg-opacity-10 rounded p-2 text-center">
                        <Settings size={16} className="text-warning mb-1" />
                        <div className="small fw-bold">8</div>
                        <div className="small text-muted">Progress</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="bg-success bg-opacity-10 rounded p-2 text-center">
                        <CheckCircle size={16} className="text-success mb-1" />
                        <div className="small fw-bold">156</div>
                        <div className="small text-muted">Resolved</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-light rounded p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-bold">Recent Complaints</span>
                      <span className="badge bg-primary">Live</span>
                    </div>
                    <div className="small text-muted">
                      <div className="d-flex justify-content-between py-1">
                        <span>Network connectivity issue</span>
                        <span className="badge bg-warning text-dark">High</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span>Software bug report</span>
                        <span className="badge bg-info">Medium</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span>Feature request</span>
                        <span className="badge bg-success">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Powerful Features for Every Role</h2>
              <p className="lead text-muted">
                Whether you're a user reporting issues, an admin managing workflows, 
                or an engineer resolving problems, ResolveNow has you covered.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <MessageSquare size={24} className="text-primary" />
                </div>
                <h5 className="fw-bold mb-3">Easy Complaint Submission</h5>
                <p className="text-muted">
                  Submit complaints with detailed descriptions, priority levels, 
                  and automatic categorization for faster resolution.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Zap size={24} className="text-success" />
                </div>
                <h5 className="fw-bold mb-3">Smart Assignment</h5>
                <p className="text-muted">
                  Intelligent complaint routing to the right engineers based on 
                  expertise, workload, and availability.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <BarChart3 size={24} className="text-info" />
                </div>
                <h5 className="fw-bold mb-3">Real-time Tracking</h5>
                <p className="text-muted">
                  Monitor complaint status in real-time with detailed progress 
                  updates and transparent communication.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Shield size={24} className="text-warning" />
                </div>
                <h5 className="fw-bold mb-3">Secure & Compliant</h5>
                <p className="text-muted">
                  Enterprise-grade security with role-based access control 
                  and complete audit trails.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Users size={24} className="text-danger" />
                </div>
                <h5 className="fw-bold mb-3">Team Collaboration</h5>
                <p className="text-muted">
                  Seamless collaboration between users, admins, and engineers 
                  with built-in communication tools.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div className="feature-icon bg-purple bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Award size={24} className="text-purple" />
                </div>
                <h5 className="fw-bold mb-3">Performance Analytics</h5>
                <p className="text-muted">
                  Comprehensive reporting and analytics to track performance 
                  and identify improvement opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Why Choose <span className="text-primary">ResolveNow</span>?
              </h2>
              <p className="lead text-muted mb-4">
                Built by experts who understand the challenges of complaint management, 
                ResolveNow combines powerful automation with human-centered design.
              </p>
              
              <div className="row g-4">
                <div className="col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <CheckCircle size={20} className="text-success mt-1" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold mb-1">100% Free</h6>
                      <p className="text-muted small mb-0">No hidden costs or subscriptions</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <Zap size={20} className="text-warning mt-1" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold mb-1">Lightning Fast</h6>
                      <p className="text-muted small mb-0">Optimized for speed and performance</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <Shield size={20} className="text-primary mt-1" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold mb-1">Secure & Private</h6>
                      <p className="text-muted small mb-0">Your data is always protected</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <Users size={20} className="text-info mt-1" />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold mb-1">Open Source</h6>
                      <p className="text-muted small mb-0">Community-driven development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="text-center">
                <div className="stats-grid">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="stat-card bg-primary bg-opacity-10 rounded-3 p-4">
                        <h3 className="display-6 fw-bold text-primary mb-1">10K+</h3>
                        <p className="text-muted mb-0">Complaints Resolved</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-card bg-success bg-opacity-10 rounded-3 p-4">
                        <h3 className="display-6 fw-bold text-success mb-1">500+</h3>
                        <p className="text-muted mb-0">Happy Organizations</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-card bg-info bg-opacity-10 rounded-3 p-4">
                        <h3 className="display-6 fw-bold text-info mb-1">98%</h3>
                        <p className="text-muted mb-0">Customer Satisfaction</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stat-card bg-warning bg-opacity-10 rounded-3 p-4">
                        <h3 className="display-6 fw-bold text-warning mb-1">24h</h3>
                        <p className="text-muted mb-0">Average Resolution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">What Our Users Say</h2>
              <p className="lead text-muted">
                Don't just take our word for it. Here's what real users think about ResolveNow.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="testimonial-card bg-white rounded-3 shadow-sm p-4 h-100">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-muted mb-3">
                  "ResolveNow transformed our complaint handling process. What used to take 
                  weeks now gets resolved in days. The transparency is incredible."
                </p>
                <div className="d-flex align-items-center">
                  <div className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <span className="text-white fw-bold">SM</span>
                  </div>
                  <div>
                    <h6 className="mb-0">Sarah Mitchell</h6>
                    <small className="text-muted">Operations Manager, TechCorp</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="testimonial-card bg-white rounded-3 shadow-sm p-4 h-100">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-muted mb-3">
                  "The intelligent assignment feature is a game-changer. Our engineers 
                  get the right complaints based on their expertise, improving resolution times."
                </p>
                <div className="d-flex align-items-center">
                  <div className="avatar bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <span className="text-white fw-bold">DJ</span>
                  </div>
                  <div>
                    <h6 className="mb-0">David Johnson</h6>
                    <small className="text-muted">IT Director, GlobalSoft</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="testimonial-card bg-white rounded-3 shadow-sm p-4 h-100">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-muted mb-3">
                  "As an engineer, I love how organized everything is. I can focus on 
                  solving problems instead of managing paperwork. Highly recommended!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="avatar bg-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <span className="text-white fw-bold">ER</span>
                  </div>
                  <div>
                    <h6 className="mb-0">Emily Rodriguez</h6>
                    <small className="text-muted">Senior Engineer, InnovateLab</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3">Ready to Transform Your Complaint Management?</h2>
              <p className="lead mb-4">
                Join thousands of organizations already using ResolveNow to streamline 
                their complaint resolution process.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/register" className="btn btn-light btn-lg px-4">
                  Get Started Free
                  <ArrowRight size={20} className="ms-2" />
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In Now
                </Link>
              </div>
              <p className="mt-3 mb-0">
                <small>100% Free • No setup required • Open source solution</small>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <span className="fw-bold fs-5 me-3">ResolveNow</span>
                <small className="text-muted">© 2024 All rights reserved.</small>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-muted">
                Built with ❤️ for better complaint management
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;