import React from 'react';
import { Link } from 'react-router-dom';
const FishTypes = () => {
  return (
    
    <>
      <div className="fish-types">
      <h2>KOI Fish Types</h2>
      <ul>
        <li>Kohaku (Red and White)</li>
        <li>Taisho Sanshoku (Sanke)</li>
        <li>Showa Sanshoku</li>
        <li>Asagi</li>
        <li>Shusui</li>
        <li>Butterfly Koi</li>
      </ul>
    </div>
    <div className="cta-section">
    <h3>Need personalized advice for your koi?</h3>
    <Link to="/booking#booking" className="cta-button">Schedule a Consultation</Link>
    </div>
    </>
  );
};

export default FishTypes;