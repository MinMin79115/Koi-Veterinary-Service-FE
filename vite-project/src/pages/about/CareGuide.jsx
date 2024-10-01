import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CareGuide.css';

const CareGuide = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="care-guide" id="care-guide-top">
      <h1>Koi Fish Care Guide</h1>
      <p>Welcome to our comprehensive guide on caring for your koi fish. Koi are beautiful and long-living creatures that require dedicated care to thrive. This guide will help you understand the essentials of koi care.</p>
      
      <div className="care-section">
        <h2>Pond Environment</h2>
        <p>A proper environment is crucial for koi health:</p>
        <ul>
          <li>Pond size: Minimum of 1,000 gallons, with at least 3 feet depth</li>
          <li>Water quality: Regular testing and maintenance of pH, ammonia, nitrite, and nitrate levels</li>
          <li>Filtration: Biological and mechanical filtration to keep water clean</li>
          <li>Aeration: Ensure proper oxygen levels, especially in warmer months</li>
          <li>Shade: Provide some shaded areas to protect koi from excessive sun exposure</li>
        </ul>
      </div>
      
      <div className="care-section">
        <h2>Feeding Your Koi</h2>
        <p>Proper nutrition is crucial for the health and color of your koi:</p>
        <ul>
          <li>Feed a high-quality, balanced koi food as the main diet</li>
          <li>Vary the diet with treats like fruits, vegetables, and live foods</li>
          <li>Feed 2-4 times a day in small amounts that can be consumed within 5 minutes</li>
          <li>Adjust feeding based on water temperature - feed less in colder months</li>
          <li>Avoid overfeeding, as it can lead to poor water quality</li>
        </ul>
      </div>
      
      <div className="care-section">
        <h2>Maintaining Water Quality</h2>
        <p>Koi require clean, well-oxygenated water to thrive:</p>
        <ul>
          <li>Perform regular water changes (10-15% weekly)</li>
          <li>Test water parameters weekly (pH, ammonia, nitrite, nitrate)</li>
          <li>Keep pH between 7.0 and 8.6</li>
          <li>Use a good quality water conditioner when adding new water</li>
          <li>Clean filters regularly according to manufacturer instructions</li>
        </ul>
      </div>
      
      <div className="care-section">
        <h2>Seasonal Care</h2>
        <p>Koi care changes with the seasons:</p>
        <ul>
          <li>Spring: Gradually increase feeding as water warms, check for any winter damage</li>
          <li>Summer: Ensure proper aeration, feed regularly, monitor for signs of stress in high temperatures</li>
          <li>Fall: Reduce feeding as water cools, prepare pond for winter</li>
          <li>Winter: Use a de-icer to keep a hole in the ice, stop feeding when water temperature drops below 50°F (10°C)</li>
        </ul>
      </div>

      <div className="care-section">
        <h2>Health Monitoring</h2>
        <p>Regular observation is key to maintaining koi health:</p>
        <ul>
          <li>Observe koi behavior daily</li>
          <li>Look for signs of illness: unusual swimming patterns, loss of appetite, visible parasites</li>
          <li>Quarantine new fish before introducing them to the main pond</li>
          <li>Have a relationship with a vet who specializes in koi or pond fish</li>
        </ul>
      </div>
      
      <div className="cta-section">
        <h3>Need personalized advice for your koi?</h3>
        <Link to="/booking#booking" className="cta-button">Schedule a Consultation</Link>
      </div>
    </div>
  );
};

export default CareGuide;