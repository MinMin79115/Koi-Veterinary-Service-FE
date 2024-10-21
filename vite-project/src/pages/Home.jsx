<<<<<<< HEAD
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast if you're using it
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
import koiImage1 from '../assets/koi-image1.jpg';
import koiImage2 from '../assets/koi-image2.jpg';
import koiImage3 from '../assets/koi-image3.jpg';
import koiImage4 from '../assets/koi-image4.jpg';
<<<<<<< HEAD
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

=======
import './Home.css';

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ');
      // Sort FAQs by id in descending order and take the first 5
      //To hard to remember :<
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
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
      // Clear input fields
      setNewQuestion('');
    }
  };

<<<<<<< HEAD
=======
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD
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
=======
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="faq-section">
                <h2 className="mb-4">Frequently Asked Questions</h2>
                {faqs && faqs.length > 0 ? (
                  <div className="accordion" id="faqAccordion">
                    {faqs.map((faq, index) => (
                      <div className="accordion-item" key={faq.id}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button 
                            className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                            type="button" 
                            onClick={() => toggleAccordion(index)}
                          >
                            {faq.Question}
                          </button>
                        </h2>
                        <div 
                          className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
                        >
                          <div className="accordion-body">
                            {faq.Answer || 'No answer yet'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No FAQs available</p>
                )}
              </div>
            </div>
            
            <div className="col-12 mt-5">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Add your FAQ</h3>
                  <form onSubmit={handleAddFAQ}>
                    <div className="mb-3">
                      <label htmlFor="question" className="form-label">Question:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="button">Add FAQ</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
      </div>
    </div>
  );
};

export default Home;