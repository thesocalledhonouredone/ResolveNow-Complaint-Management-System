import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, User, LogOut, Settings, LogIn, UserPlus, Menu, X, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setIsMenuOpen(false);
    navigate('/register');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-20 rounded-circle p-2 me-2">
              <MessageSquare size={20} className="text-white" />
            </div>
            <span className="fw-bold">ResolveNow</span>
          </div>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActivePath('/') ? 'active' : ''}`} 
                to="/" 
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActivePath('/dashboard') ? 'active' : ''}`} 
                    to="/dashboard" 
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActivePath('/submit-complaint') ? 'active' : ''}`} 
                    to="/submit-complaint" 
                    onClick={closeMenu}
                  >
                    Submit Complaint
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${isActivePath('/admin') ? 'active' : ''}`} 
                      to="/admin" 
                      onClick={closeMenu}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            {isAuthenticated ? (
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center w-100">
                {/* User Profile Section */}
                <li className="nav-item dropdown position-relative me-lg-3 mb-2 mb-lg-0">
                  <button 
                    className="nav-link dropdown-toggle d-flex align-items-center btn btn-link text-white border-0 p-2 rounded w-100 justify-content-between" 
                    onClick={toggleUserMenu}
                    aria-expanded={isUserMenuOpen}
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-white rounded-circle p-2 me-2">
                        <User size={16} className="text-primary" />
                      </div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="fw-semibold small">{user?.name}</span>
                        <small className="text-white-50" style={{ fontSize: '0.75rem' }}>
                          {user?.role}
                        </small>
                      </div>
                    </div>
                    <ChevronDown size={14} className="ms-2" />
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end w-100 ${isUserMenuOpen ? 'show' : ''}`}>
                    <li>
                      <div className="dropdown-header">
                        <div className="fw-semibold">{user?.name}</div>
                        <small className="text-muted">{user?.email}</small>
                        <div className="mt-1">
                          <span className="badge bg-primary">{user?.role}</span>
                        </div>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center" 
                        onClick={(e) => e.preventDefault()}
                      >
                        <Settings size={16} className="me-3" />
                        Account Settings
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center text-danger" 
                        onClick={handleLogout}
                      >
                        <LogOut size={16} className="me-3" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
                
                {/* Quick Logout Button - Visible on larger screens */}
                <li className="nav-item d-none d-xl-block">
                  <button 
                    className="btn btn-outline-light btn-sm d-flex align-items-center px-3" 
                    onClick={handleLogout}
                    title="Quick Logout"
                  >
                    <LogOut size={16} className="me-2" />
                    Sign Out
                  </button>
                </li>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light d-flex align-items-center justify-content-center w-100" 
                    onClick={handleLogin}
                  >
                    <LogIn size={18} className="me-2" />
                    Sign In
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-light text-primary d-flex align-items-center justify-content-center w-100" 
                    onClick={handleRegister}
                  >
                    <UserPlus size={18} className="me-2" />
                    Get Started
                  </button>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;