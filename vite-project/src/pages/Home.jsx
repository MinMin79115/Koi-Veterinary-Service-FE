import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast if you're using it
import koiImage1 from '../assets/koi-image1.jpg';
import koiImage2 from '../assets/koi-image2.jpg';
import koiImage3 from '../assets/koi-image3.jpg';
import koiImage4 from '../assets/koi-image4.jpg';
import '../components/Header.css';
import './Home.css';

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ');
      // Sort FAQs by id in descending order and take the first 5
      const sortedFaqs = response.data.sort((a, b) => b.id - a.id).slice(0, 5);
      setFaqs(sortedFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to fetch FAQs');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    if (newQuestion) {
      // Create new FAQ object
      const newFAQ = { Question: newQuestion, Answer: '' };
      // Update FAQs, adding the new one and keeping only the 5 most recent
      await axios.post('https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ', newFAQ);
      fetchFaqs();
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
          {faqs && faqs.length > 0 ? (
            faqs.map((faq) => (
              <div className="faq-item" key={faq.id}>
                <h4>{faq.Question}</h4>
                <p>{faq.Answer || 'No answer yet'}</p>
              </div>
            ))
          ) : (
            <p>No FAQs available</p>
          )}
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