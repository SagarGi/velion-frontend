import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Velion DKN
        </Link>

        {isAuthenticated ? (
          <ul className="navbar-menu">
            <li>
              <Link to="/" className="navbar-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/documents" className="navbar-link">
                Documents
              </Link>
            </li>
            <li>
              <Link to="/upload" className="navbar-link">
                Upload
              </Link>
            </li>
            {user?.is_reviewer && (
              <li>
                <Link to="/review" className="navbar-link">
                  Review
                </Link>
              </li>
            )}
            <li>
              <Link to="/leaderboard" className="navbar-link">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/experts" className="navbar-link">
                Experts
              </Link>
            </li>
            <li>
              <span className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser /> {user?.name}
              </span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <FiLogOut /> Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-menu">
            <li>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-outline">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
