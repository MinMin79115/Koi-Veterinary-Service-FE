import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast if you're using it
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import koiImage1 from '../assets/koi-image1.jpg';
import koiImage2 from '../assets/koi-image2.jpg';
import koiImage3 from '../assets/koi-image3.jpg';
import koiImage4 from '../assets/koi-image4.jpg';
import api from '../config/axios';
import './Home.css';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import { StarFilled, UserOutlined } from '@ant-design/icons';
import { Card, Rate, Avatar } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const token = useSelector(state => state.user?.accessToken);
  const [value, setValue] = React.useState(1);
  const [valuesToSend, setValuesToSend] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking);
  console.log(booking);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ');
      // Sort FAQs by id in descending order and take the first 5
      //To hard to remember :<
      const sortedFaqs = response.data.sort((a, b) => b.id - a.id).slice(0, 5);
      setFaqs(sortedFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('feedback');
      setFeedbacks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  }

  useEffect(() => {
    fetchFaqs();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (value && feedbackText && booking) {
      setValuesToSend({
        rating: value,
        bookingId: booking.id,
        feedback: feedbackText
      });
    }
  }, [value, feedbackText, booking]);

  useEffect(() => {
    if (location.hash === '#rating') {
      window.scrollTo(0, 1900);
    }
  }, [location]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('feedback', valuesToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Rating and feedback submitted!");
      setFeedbackText('');
      setValue(1);
      setBooking(null);
      window.history.replaceState({}, document.title);
      fetchFeedbacks()
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error("Failed to submit rating");
    }
  };

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

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCancelRating = () => {
    setBooking(null);
    setFeedbackText('');
    setValue(1);
    // Clear location state
    window.history.replaceState({}, document.title);
  };

  return (
    <>
      <div >
        <Carousel

          fade={true}
          interval={3000}
          controls={false}
          indicators={true}
          pause={false}
          touch={false}
          className="carousel-fade"
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={koiImage1}
              alt="First slide"
            />
            <Carousel.Caption>
              <h1>Discover the Art of KOI Fish Care</h1>
              <p>Create a serene and beautiful pond ecosystem for your KOI</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={koiImage2}
              alt="Second slide"
            />
            <Carousel.Caption>
              <h1>Discover the Art of KOI Fish Care</h1>
              <p>Create a serene and beautiful pond ecosystem for your KOI</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={koiImage3}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h1>Discover the Art of KOI Fish Care</h1>
              <p>Create a serene and beautiful pond ecosystem for your KOI</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={koiImage4}
              alt="Fourth slide"
            />
            <Carousel.Caption>
              <h1>Discover the Art of KOI Fish Care</h1>
              <p>Create a serene and beautiful pond ecosystem for your KOI</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="home">
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
          <Link to="/booking#booking">Schedule here.</Link>
        </div>
        {/* Rating here */}
        {booking && (
          <Box
            sx={{
              '& > legend': { mt: 2 },
              padding: '2rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              margin: '2rem auto',
              maxWidth: '500px'
            }}
          >
            <Typography variant="h5" component="legend" sx={{ mb: 2 }}>Your Rating</Typography>
            <div className='d-flex justify-content-center'>
              <div className='d-flex flex-column align-items-center w-100'>
                <form onSubmit={handleSubmitRating} className='w-100'>
                  <Typography>Booking ID: {booking.id}</Typography>
                  <Typography>Service Name: {booking.service}</Typography>

                  <div className='my-3'>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      size="large"
                    />
                  </div>

                  <div className='mb-3'>
                    <Typography component="legend" sx={{ mb: 1 }}>Your Feedback</Typography>
                    <Input.TextArea
                      className='form-control'
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Please share your experience..."
                      rows={4}
                      maxLength={200}
                      required
                      style={{
                        resize: 'none',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      type='primary'
                      htmlType='submit'
                      size='large'
                      block
                    >
                      Submit Rating
                    </Button>
                    <Button
                      type='primary'
                      danger
                      size='large'
                      block
                      onClick={handleCancelRating}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Box>
        )}

        {feedbacks && feedbacks.length > 0 && (
          <div className="feedback-section">
            <h2 className="feedback-title">What Our Customers Say</h2>
            <Swiper
              spaceBetween={30}
              centeredSlides={false}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="feedback-swiper"
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {feedbacks.map((feedback, index) => (
                <SwiperSlide key={feedback.id}>
                  <Card
                    className="feedback-card"
                    bordered={false}
                  >
                    <div className="feedback-header">
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        className="feedback-avatar"
                      />
                      <div className="feedback-user-info">
                        <h4>{feedback.user?.fullname || 'Anonymous'}</h4>
                        <Rating 
                          disabled 
                          defaultValue={feedback.rating} 
                          character={<StarFilled />}
                          className="feedback-rating"
                        />
                      </div>
                    </div>
                    <div className="feedback-service">
                      {feedback.bookingId?.servicesDetail?.serviceId?.serviceName === "Online Consulting" ? (
                        <p>{feedback.bookingId?.servicesDetail?.serviceId?.serviceName}
                          <br/> <small>Online</small>
                        </p>
                      ) : (
                          <div className='d-flex flex-column gap-6'>
                            <p>{feedback.bookingId?.servicesDetail?.serviceId?.serviceName}
                            <small> <br/> {feedback.bookingId?.servicesDetail?.serviceTypeId?.service_type}</small>
                            </p>
                          </div>
                      )}
                    </div>
                    <div className="feedback-content">
                      <p>"{feedback.feedback}"</p>
                    </div>
                    
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        {/* FAQ here */}
        <div>
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
                <div className="card add-faq-section">
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
        </div>
      </div>
    </>
  );
};

export default Home;