import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import koiLogo from '../assets/koi-logo.png'; // Import the image
import './Header.css';
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from '../redux/features/userSlider';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status using token from secureLocalStorage
    const checkLogin = sessionStorage.getItem("userToken");
    if (checkLogin) {
      setIsLoggedIn(true);
    }
    // Adjust the key as needed
    setIsLoggedIn(!!user); // Set true if token exists
  }, []);

  const handleLogout = () => {
    // Clear all items from secureLocalStorage
    sessionStorage.clear();
    dispatch(logout())
    // Update state to reflect that the user is logged out
    setIsLoggedIn(false); // Update state on logout
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={koiLogo} alt="KOI Fish Care Logo" />

          <h1><Link className="h1-logo" to="/">Koi Fish Care</Link></h1>
        </div>
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link onClick={handleLinkClick} to="/">Home</Link></li>
            <li><Link onClick={handleLinkClick} to="/services">Services</Link></li>
            <li><Link onClick={handleLinkClick} to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="auth-nav">
          {isLoggedIn ? (
            <>
              <Link to="/customer-profile#profile" className='auth-user user-icon'>
                <i>
                  <FaRegUserCircle />
                </i>
              </Link>
              <Link to="/" onClick={handleLogout} className='auth-button '>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button login">Login</Link>
              <Link to="/register" className="auth-button register">Register</Link>
            </>
          )}
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;