import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AboutUs.css';
import vet1Image from '../../assets/koi-image1.jpg';
import vet2Image from '../../assets/koi-image2.jpg';
import vet3Image from '../../assets/koi-image3.jpg';

const AboutUs = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#team') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="about-us" id="team">
      <h1>About Our Veterinary Team</h1>
      <div className="vet-container">
        <div className="vet-card">
          <img src={vet1Image} alt="Dr. Thuan Nguyen Minh" />
          <h2>Dr. Thuan Nguyen</h2>
          <p>Dr. Thuan specializes in koi and ornamental fish health. With over 15 years of experience, she has helped countless fish owners maintain healthy and vibrant ponds.</p>
        </div>
        <div className="vet-card">
          <img src={vet2Image} alt="Dr. Dung Pham Hung" />
          <h2>Dr. Hung Dung</h2>
          <p>Dr. Dung is an expert in aquatic ecosystems and water quality management. His research on koi nutrition has been published in several prestigious journals.</p>
        </div>
        <div className="vet-card">
          <img src={vet3Image} alt="Dr. Minh Tran Huu Nhat " />
          <h2>Dr. Nhat Minh</h2>
          <p>Dr. Minh focuses on preventative care for koi and other pond fish. She is passionate about educating fish owners on best practices for maintaining a healthy aquatic environment.</p>
        </div>
      </div>
      {/* Schedule here */}
      <div className="schedule-exam">
        <h2>Schedule a Fish Exam</h2>
        <Link to="/booking">Schedule here.</Link>
      </div>
    </div>
  );
};

export default AboutUs;