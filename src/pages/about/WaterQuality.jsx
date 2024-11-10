import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './WaterQuality.css';
import koiWaterQuality from '../../assets/koi-feed-quality-water.jpg';

const WaterQuality = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="water-quality" id="water-quality-top">
      <img src={koiWaterQuality} alt="Koi Water Quality" />
      <h1>Water Quality Tips for Koi Ponds</h1>
      <p>
        On the surface, the differences between ornamental ponds and koi ponds may not seem great. 
        After all, a koi pond is simply an ornamental pond with koi, right? In reality, a koi pond 
        is a complex ecosystem in miniature form, and careful consideration is placed on water quality. 
        Transform your pond into a thriving aquatic system with beautiful koi using these water quality tips.
      </p>

      <div className="tip-section">
        <h2>The larger the pond, the better</h2>
        <p>
          Pond water volume has a strong relationship with water quality. Simply put, large water volume 
          means more stable water parameters. More importantly, the concentration of pollutants is diluted 
          and distributed more evenly to help defer their ill effects. The ideal koi pond contains at least 
          1,000 gallons of water.
        </p>
      </div>

      <div className="tip-section">
        <h2>Efficient filtration</h2>
        <p>
          Filtration systems for koi ponds should filter or turn over the entire water volume at least twice 
          an hour. There should be an emphasis on biological filtration to ensure efficient breakdown of 
          nitrogen waste products. Fortify biological filtration with bacterial additives such as our Live 
          Nitrifying Bacteria.
        </p>
      </div>

      <div className="tip-section">
        <h2>Aerate</h2>
        <p>
          As coldwater fish, koi are accustomed to high dissolved oxygen content in water. Pond water needs 
          to be well oxygenated, especially during warm summer months when water is less able to retain oxygen. 
          Increase water agitation (air to water contact) via streams, water fountains, waterfalls, or aeration 
          devices to replenish vital oxygen levels.
        </p>
      </div>

      <div className="tip-section">
        <h2>Proper feeding</h2>
        <p>
          Uneaten or poorly digested food can foul pond water. Be sure to feed seasonally appropriate food 
          in correct amounts to prevent poor water quality. Our full line of premium koi foods helps ensure 
          good water quality and koi health.
        </p>
      </div>

      <div className="cta-section">
        <h3>Need help maintaining your koi pond?</h3>
        <Link to="/booking#booking" className="cta-button">Schedule a Consultation</Link>
      </div>
    </div>
  );
};

export default WaterQuality;