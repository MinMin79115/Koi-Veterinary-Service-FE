import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Booking.css';
import { toast } from 'react-toastify';

const Booking = () => {
  const location = useLocation();
  const [type, setType] = useState('');
  const [service, setService] = useState('');
  const [slot, setSlot] = useState('');
  const [doctor, setDoctor] = useState('');

  const doctors = {
    '9am-10am': 'Dr. John Smith',
    '10am-11am': 'Dr. Emily Johnson',
    '11am-12pm': 'Dr. Michael Brown',
    '1pm-2pm': 'Dr. Sarah Davis',
    '2pm-3pm': 'Dr. Lisa Wilson',
    '3pm-4pm': 'Dr. David Lee',
    '4pm-5pm': 'Dr. Anna Taylor',
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('api/services', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setServices(response.data);
    } catch (error) {
      toast.error('Error fetching services:', error.response.data);
    }
  }


  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (location.hash === '#booking') {
      window.scrollTo(90, 200);
    }
  }, [location]);

  useEffect(() => {
    // Set default type to "online-type" if the selected service is "interview"
    if (service === "interview") {
      setType("online-type");
    } else if (service === "pond-quality") {
      setType('at-home-type'); // Reset type if the service is not "interview"
    } else {
      setType('');
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', { type, service });
    toast.success('Booking submitted successfully!');
    setType('');
    setService('');
  };

  const handleSlotChange = (e) => {
    const selectedSlot = e.target.value;
    setSlot(selectedSlot);
    setDoctor(doctors[selectedSlot] || ''); // Set doctor based on selected slot
  };

  return (
    <div className="booking-container">
      <h2>Book a Service</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group-booking">
          <label htmlFor="service">Services:</label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            <option value="pond-quality">Pond Quality</option>
            <option value="fish-health-check">Fish Health Check</option>
            <option value="interview">Interview</option>
          </select>
        </div>
        <div className="form-group-booking">
          <label htmlFor="service-type">Service Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="online-type" disabled={service === "pond-quality"} >Online</option>
            <option value="offline-type" disabled={service === "interview" || service === "pond-quality"}>At center</option>
            <option value="at-home-type" disabled={service === "interview"}>At home</option>
          </select>
        </div>
        <div className="form-group-booking">
          <label htmlFor="slot">Slot:</label>
          <select
            id="slot"
            value={slot}
            onChange={handleSlotChange}
            required
          >
            <option value="">Select a Slot</option>
            <option value="9am-10am">9:00 AM - 10:00 AM</option>
            <option value="10am-11am">10:00 AM - 11:00 AM</option>
            <option value="11am-12pm">11:00 AM - 12:00 PM</option>
            <option value="1pm-2pm">1:00 PM - 2:00 PM</option>
            <option value="2pm-3pm">2:00 PM - 3:00 PM</option>
            <option value="3pm-4pm">3:00 PM - 4:00 PM</option>
            <option value="4pm-5pm">4:00 PM - 5:00 PM</option>
          </select>

          {doctor && (
            <div className="form-group-booking">
              <div className="doctor">
              <label htmlFor="doctor-information">Your doctor:</label>
              <p>{doctor}</p>
            </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Book Now</button>
      </form>
    </div>
  );
};

export default Booking;