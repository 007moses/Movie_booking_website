import React, { useState } from 'react';
import '../Styles/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href="/" className="logo-text">
            🎬 MovieMagic
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <a href="/movies" className="navbar-link">
            Movies
          </a>
          <a href="/bookings" className="navbar-link">
            My Bookings
          </a>
          <a href="/theaters" className="navbar-link">
            Theaters
          </a>
          <a href="/profile" className="navbar-link">
            Profile
          </a>
          <a href="/login" className="navbar-login">
            Login
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-mobile-toggle">
          <button
            onClick={toggleMobileMenu}
            className="mobile-toggle-btn"
            aria-label="Toggle menu"
          >
            <svg
              className="toggle-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <a href="/movies" className="navbar-mobile-link">
            Movies
          </a>
          <a href="/bookings" className="navbar-mobile-link">
            My Bookings
          </a>
          <a href="/theaters" className="navbar-mobile-link">
            Theaters
          </a>
          <a href="/profile" className="navbar-mobile-link">
            Profile
          </a>
          <a href="/login" className="navbar-mobile-login">
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;