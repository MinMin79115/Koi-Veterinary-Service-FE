import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import koiLogo from '../assets/koi-logo.png';
import './Header.css';
import { FaRegUserCircle } from "react-icons/fa";
import { logout } from '../redux/features/userSlider';
import { bookingReset } from '../redux/features/bookingSlider';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'antd';

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    dispatch(bookingReset());
    scrollToTop();
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    scrollToTop();
  };

  const items = [
    {
      key: '1',
      label: <Link onClick={scrollToTop} to="/customer-profile">Profile</Link>,
    },
    {
      key: '2',
      label: <Link onClick={handleLogout} to="/login">Logout</Link>,
    },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={koiLogo} alt="KOI Fish Care Logo" />
<<<<<<< Updated upstream

          <h1><Link className="h1-logo" to="/">Koi Fish Care</Link></h1>
=======
          <h1><Link onClick={scrollToTop} className="h1-logo" to="/">Koi Fish Care</Link></h1>
>>>>>>> Stashed changes
        </div>
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link onClick={handleLinkClick} to="/">Home</Link></li>
            <li><Link onClick={handleLinkClick} to="/services">Services</Link></li>
            <li><Link onClick={handleLinkClick} to="/contact">Contact</Link></li>
            <li>{user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN' ? 
              <Link onClick={handleLinkClick} to="/booking-detail">History</Link> : 
              <Link onClick={handleLinkClick} to="/booking-management">History</Link>}
            </li>
          </ul>
        </nav>
        <div className="auth-nav">
          {user ? (
            <>
              <Dropdown menu={{ items }} placement="bottomRight">
                <Link className='auth-user user-icon'>
                  <i>
                    <FaRegUserCircle />
                  </i>
                </Link>
              </Dropdown>
            </>
          ) : (
            <>
              <Link onClick={scrollToTop} to="/login" className="auth-button login">Login</Link>
              <Link onClick={scrollToTop} to="/register" className="auth-button register">Register</Link>
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
