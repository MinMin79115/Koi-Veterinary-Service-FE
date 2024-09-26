import React from 'react';
import { Link } from 'react-router-dom';
const CustomerDashboard = () => {
  return (
    
    <div className="dashboard">
      <h2>Customer Profile</h2>
      <nav>
        <ul>
          <li><Link to="/booking">Make a Booking</Link></li>
          <li><Link to="/profile">Edit Profile</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomerDashboard;