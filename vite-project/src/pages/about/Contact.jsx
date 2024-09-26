import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Contact.css';
// import contactImage from '../assets/koi-contact.jpg'; // Make sure to add this image to your assets folder

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contact') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <div className="contact">
      <div className="contact-hero">
        <h1>Contact With Us Today</h1>
        <p>We're here to answer any questions you have about KOI fish care</p>
      </div>
      <div className="contact-content">
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="contact-info">
          {/* <img src={contactImage} alt="KOI Fish" /> */}
          <h2>Contact Information</h2>
          <p>123 KOI Street, Pond City, PC 12345</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@koifishcare.com</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
      <div className="cta-section">
        <h3>Need personalized advice for your koi?</h3>
        <Link to="/booking#booking" className="cta-button">Schedule a Consultation</Link>
      </div>
    </div>
  );
};

export default Contact;