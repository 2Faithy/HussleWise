import './Header.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when clicking auth buttons
  const handleAuthClick = () => {
    setIsMenuOpen(false);
  };

  // Check if current page is signup
  const isSignupPage = location.pathname === '/signup';

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Business Companion Logo" className="logo-img" />
        </Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav className={`nav ${isMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="nav-list">
          <li><Link to="/" onClick={handleAuthClick}>Home</Link></li>
          <li><Link to="/features" onClick={handleAuthClick}>Features</Link></li>
          <li><Link to="/pricing" onClick={handleAuthClick}>Pricing</Link></li>
          <li><Link to="/about-us" onClick={handleAuthClick}>About Us</Link></li>
          <li><Link to="/support" onClick={handleAuthClick}>Support</Link></li>
        </ul>

        <div className="auth-buttons">
          <Link 
            to={isSignupPage ? "#login" : "/signup#login"} 
            className="sign-in" 
            onClick={handleAuthClick}
            state={{ from: location.pathname }}
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="sign-up" 
            onClick={handleAuthClick}
            state={{ from: location.pathname }}
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}