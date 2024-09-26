import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <div className="services-grid">
        <div className="service-item">
          <h2>Care Guide</h2>
          <p>Learn how to properly care for your KOI fish.</p>
          <Link to="/care-guide" className="service-link">Read More</Link>
        </div>
        <div className="service-item">
          <h2>Water Quality</h2>
          <p>Understand and maintain optimal water conditions for your KOI.</p>
          <Link to="/water-quality" className="service-link">Learn More</Link>
        </div>
        <div className="service-item">
          <h2>Fish Types</h2>
          <p>Explore various KOI fish types and their characteristics.</p>
          <Link to="/fish-types" className="service-link">Discover</Link>
        </div>
        <div className="service-item">
          <h2>Book a Service</h2>
          <p>Schedule a professional KOI care service.</p>
          <Link to="/booking#booking" className="service-link">Book Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;