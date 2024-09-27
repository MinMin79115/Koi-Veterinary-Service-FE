import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import koiImage1 from '../assets/koi-image1.jpg';
import koiImage2 from '../assets/koi-image2.jpg';
import koiImage3 from '../assets/koi-image3.jpg';
import koiImage4 from '../assets/koi-image4.jpg';
import '../components/Header.css';
import './Home.css';


const Home = () => {

  const [faqs, setFaqs] = useState([
    {
      question: "What is the best diet for KOI fish?",
      answer: "KOI fish thrive on a balanced diet that includes high-quality pellets, vegetables, and occasional treats like fruits."
    },
    {
      question: "How often should I feed my KOI fish?",
      answer: "Feed your KOI fish 2-3 times a day, only as much as they can consume in 5-10 minutes."
    },
    {
      question: "What temperature is ideal for KOI fish?",
      answer: "KOI fish prefer water temperatures between 65°F and 75°F (18°C to 24°C)."
    },
    {
      question: "How can I tell if my KOI fish are healthy?",
      answer: "Healthy KOI fish are active, have bright colors, and show no signs of distress or disease."
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');

  const handleAddFAQ = (e) => {
    e.preventDefault();
    if (newQuestion) {
      // Create new FAQ object
      const newFAQ = { question: newQuestion };

      // Update FAQs, removing the oldest if there are already 5
      setFaqs((prevFaqs) => {
        const updatedFaqs = [...prevFaqs, newFAQ];
        if (updatedFaqs.length > 5) {
          updatedFaqs.shift(); // Remove the oldest FAQ
        }
        return updatedFaqs;
      });

      // Clear input fields
      setNewQuestion('');
    }
  };

  return (
    <div className="home">

      <div className="hero">
        <h1>Discover the Art of KOI Fish Care</h1>
        <p>Create a serene and beautiful pond ecosystem for your KOI</p>
        <div className="hero-container">
          <div className="koi-image">
            <img src={koiImage1} alt="KOI Fish" />
          </div>
          <div className="koi-image">
            <img src={koiImage2} alt="KOI Fish" />
          </div><div className="koi-image">
            <img src={koiImage3} alt="KOI Fish" />
          </div><div className="koi-image">
            <img src={koiImage4} alt="KOI Fish" />
          </div>
        </div>
      </div>
      <div className="featured-sections">
        <div className="featured-section">
          <h3>Care Guide</h3>
          <p>Learn essential tips for maintaining healthy KOI fish.</p>
          <Link to="/care-guide">Read More</Link>
        </div>
        <div className="featured-section">
          <h3>Water Quality</h3>
          <p>Understand the importance of water quality for KOI health.</p>
          <Link to="/water-quality">Learn More</Link>
        </div>
        <div className="featured-section">
          <h3>Meet Our Veterinarians</h3>
          <p>Get to know our expert team of fish care specialists.</p>
          <Link to="/about#team">Meet the Team</Link>
        </div>
      </div>
      <div className="koi-facts">
        <h2>Our Services for All Fish</h2>
        <div className="fact-container">
          <div className="fact">
            <h3>Complete Pond/Tank Packages</h3>
            <p>Receive a complete assessment of the health of your pond or tank. These packages include water quality testing and physical exams of your fish under sedation.
            </p>
            <Link to="/services">Learn More</Link>

          </div>
          <div className="fact">
            <h3>Fish Physical Exams</h3>
            <p>All fish seen by our service are given thorough and complete physical exams. All fish are captured in a safe and efficient manner and usually given sedatives to make the experience low stress.
            </p>
            <Link to="/services">Learn More</Link>

          </div>
          <div className="fact">
            <h3>Online Consultation</h3>
            <p>We offer online consultations for those who are unable to bring their fish to us for an exam. We will need photos and any information you would like us to address.
            </p>
            <Link to="/services">Learn More</Link>
          </div>
        </div>
      </div>
      {/* Schedule here */}
      <div className="schedule-exam">
        <h2>Schedule a Fish Exam</h2>
        <Link to="/booking">Schedule here.</Link>
      </div>
      <div>
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddFAQ} className="faq-form">
          <h3>Add your FAQ</h3>
          <div>
            <label htmlFor="question">Question:</label>
            <input
              type="text"
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            />
          </div>

          <button type="submit">Add FAQ</button>
        </form>
      </div>
    </div>
  );
};

export default Home;