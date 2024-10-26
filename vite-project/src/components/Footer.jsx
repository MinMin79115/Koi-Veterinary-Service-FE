import React from 'react';
import { Link } from 'react-router-dom';
import koiLogo from '../assets/koi-logo.png'; // Import the image
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={koiLogo} alt="KOI Fish Care Logo" />
          <span>KOI Fish Care</span>
        </div>
        <nav className="footer-nav">
          <Link to="/about#team">About Us</Link>
          <Link to="/contact#contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </nav>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 KOI Fish Care. All rights reserved.</p>
      </div>
<<<<<<< HEAD
      
=======
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
    </footer>
  );
};

export default Footer;