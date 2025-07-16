import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Home, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          ResolveNow
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <Home size={16} className="me-1" />
                Dashboard
              </Link>
            </li>
            {user?.role === 'user' && (
              <li className="nav-item">
                <Link className="nav-link" to="/new-complaint">
                  <Plus size={16} className="me-1" />
                  New Complaint
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="userDropdown"
              >
                <User size={16} className="me-2" />
                {user?.name} ({user?.role})
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                    <LogOut size={16} className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;