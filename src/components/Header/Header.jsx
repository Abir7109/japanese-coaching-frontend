import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin, isTeacher } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">🌸 日本語コーチング</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-ocean hover:text-teal transition-colors font-medium">
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-ocean hover:text-teal transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/profiles" className="text-ocean hover:text-teal transition-colors font-medium">
                  Students
                </Link>
                {(isAdmin || isTeacher) && (
                  <Link to="/admin" className="text-ocean hover:text-teal transition-colors font-medium">
                    Admin
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover border-2 border-aqua" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-aqua to-teal rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-ocean font-medium">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-ocean hover:text-teal transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ocean hover:text-teal transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/profiles" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
                  Students
                </Link>
                {(isAdmin || isTeacher) && (
                  <Link to="/admin" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-primary w-full text-left">
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block py-2 text-ocean hover:text-teal transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary inline-block">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
