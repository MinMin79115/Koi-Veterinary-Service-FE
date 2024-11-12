import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import koiLogo from '../assets/koi-logo.png'; // Import the image
import './Header.css';
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from '../redux/features/userSlider';
import { bookingReset } from '../redux/features/bookingSlider';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!user); // Set true if token exists
    console.log(user);
  }, [user]);

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state
    dispatch(logout());
    dispatch(bookingReset());
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" >
          <img src={koiLogo} alt="KOI Fish Care Logo" />
          <h1><Link className="h1-logo" to="/">Koi Fish Care</Link></h1>
        </div>
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link onClick={handleLinkClick} to="/">Home</Link></li>
            <li><Link onClick={handleLinkClick} to="/services">Services</Link></li>
            <li><Link onClick={handleLinkClick} to="/contact">Contact</Link></li>
            <li>{user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN' ? <Link onClick={handleLinkClick} to="/booking-detail">History</Link> : <Link onClick={handleLinkClick} to="/booking-management">History</Link>}</li>
          </ul>
        </nav>
        <div className="auth-nav">
          {user ? (
            <>
              <Link to="/customer-profile#profile" className='auth-user user-icon'>
                <i>
                  <FaRegUserCircle />
                </i>
              </Link>
              <Link to='/login' onClick={handleLogout} className='auth-button '>Logout</Link>
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