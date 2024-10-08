import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';
import { toast } from 'react-toastify';
import axios from 'axios'
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import { Form, DatePicker } from 'antd';
import moment from 'moment';

const Booking = () => {
  const apiDoctors = 'https://66fb49048583ac93b40b4dc0.mockapi.io/Doctors';
  const apiService = 'https://66ff9fda4da5bd23755149e9.mockapi.io/Service';
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState([]);
  const [services, setServices] = useState([]);
  const [slot, setSlot] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);
  const [values, setValues] = useState({
    service_name: '',
    type: type,
    slot: '',
    doctor_name: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isInterviewService, setIsInterviewService] = useState(false);

  const fetchDoctors = async () => {
    try {
      // const response = await api.get('api/doctors', {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // })
      const response = await axios.get(apiDoctors);
      console.log(response.data);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Error fetching doctors:', error.response.data);
    }
  }

  const fetchServices = async () => {
    try {
      // const response = await api.get('api/services', {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // });

      const response = await axios.get(apiService);
      {
        response.data.map((service) => (
          service.type = ['online', 'offline', 'at home']
        ))
      }
      console.log(response.data)
      console.log(type)
      setServices(response.data);
    } catch (error) {
      toast.error('Error fetching services:', error.response.data);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (location.hash === '#booking') {
      window.scrollTo(90, 200);
    }

  }, [location]);

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    setValues(prevValues => ({ ...prevValues, service_name: serviceName }));
    setSelectedService(serviceName);
    setIsInterviewService(serviceName.toLowerCase() === 'interview');

    const selectedServiceObj = services.find(service => service.name === serviceName);
    if (selectedServiceObj) {
      setAvailableTypes(selectedServiceObj.type);
      if (selectedServiceObj.type.length === 1) {
        setType(selectedServiceObj.type[0]);
        setValues(prevValues => ({ ...prevValues, type: selectedServiceObj.type[0] }));
      } else {
        setType('');
        setValues(prevValues => ({ ...prevValues, type: '' }));
      }
    } else {
      setAvailableTypes([]);
      setType('');
      setValues(prevValues => ({ ...prevValues, type: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      //request all information of this booking
      // form to booking detail and booking management
      try {
        // const response = await api.post(apiService, { type, service })
        const response = await api.post('booking', values);
        //   headers:
        //   {
        //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
        //   }
        // });
        console.log('Booking submitted:', values);
        toast.success('Booking submitted successfully!');
        setType('');
        setServices('');
        navigate("/booking-detail")
      } catch (error) {
        toast.error(error.response.data);
      }
    } else {
      toast.error('Please login to book a service')
      navigate("/login")
    }

  };

  const handleSlotChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      const [selectedSlot, selectedDoctorName] = selectedValue.split('|');
      setValues(prevValues => ({
        ...prevValues,
        slot: selectedSlot,
        doctor_name: selectedDoctorName
      }));
      setSlot(selectedSlot);
      setSelectedDoctor(selectedDoctorName);
    } else {
      setSlot('');
      setSelectedDoctor('');
      setValues(prevValues => ({ ...prevValues, slot: '', doctor_name: '' }));
    }
  };

  const handleDateTimeChange = (value) => {
    setSelectedDateTime(value);
    if (value) {
      const formattedDateTime = value.format('YYYY-MM-DD HH:mm');
      setValues(prevValues => ({
        ...prevValues,
        slot: formattedDateTime,
      }));
    } else {
      setValues(prevValues => ({ ...prevValues, slot: '' }));
    }
  };

  const disabledDate = (current) => {
    // Can't select days before today and today
    return current && current < moment().endOf('day');
  };

  return (
    <div className="booking-container">
      <h2>Book a Service</h2>
      <Form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group-booking">
          <label htmlFor="service">Services:</label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        {/* check availableType not null to choose type */}
        {/* if availableType length = 1, show only 1 option */}
        {/* if availableType length > 1, show all option */}
        {availableTypes.length > 0 && (
          <div className="form-group-booking">
            <label htmlFor="services-type">Service Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setValues(prevValues => ({ ...prevValues, type: e.target.value }));
              }}
              required
            >
              {availableTypes.length === 1 ? (
                <option value={availableTypes[0]}>{availableTypes[0]}</option>
              ) : (
                <>
                  <option value="">Select a type</option>
                  {availableTypes.map((serviceType) => (
                    <option key={serviceType} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        )}
        {/* when I choose slot the docter name of this slot 
        will be set in handleSlotChange func to show in screen */}
        <div className="form-group-booking">
        <label htmlFor="slot">Slot:</label>
        {isInterviewService ? (
            <Form.Item
              name="workTime"
              label="Select Date and Time"
              rules={[{ required: true, message: 'Please select the date and time!' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                onChange={handleDateTimeChange}
                value={selectedDateTime}
              />
            </Form.Item>
          ) : (
            <select
              id="slot"
              value={`${slot}|${selectedDoctor}`}
              onChange={handleSlotChange}
              required
            >
              <option value="">Select a Slot</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={`${doctor.workTime}|${doctor.name}`}>
                  {doctor.workTime}
                </option>
              ))}
            </select>
          )}
          {/* Show doctor name when I have choosen slot above */}
          {selectedDoctor && !isInterviewService && (
            <div className="form-group-booking">
              <div className="doctor">
                <label htmlFor="doctor-information">Your doctor:</label>
                <p>{selectedDoctor}</p>
              </div>
            </div>
          )}
        </div>
        {/* If user == null return /login page to confirm booking */}
        <button type="submit" className="submit-btn">Book Now</button>
      </Form>
    </div>
  );
};

export default Booking;