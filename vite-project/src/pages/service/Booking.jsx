import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import session from 'redux-persist/lib/storage/session';

const Booking = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [slots, setSlots] = useState([]); // Change this line
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedSlot, setSelectedSlot] = useState({
    slotId: '',
    startTime: '',
    endTime: '',
    slotDate: ''
  })
  const [values, setValues] = useState({
    serviceId: '',
    slotId: '',
    doctorId: '',
    time: {
      startTime: '',
      endTime: '',
      slotDate: ''
    },
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isInterviewService, setIsInterviewService] = useState(false)
  //Hàm validate chọn time
  const validateTimeRange = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please select the date and time!'));
    }

    const time = moment(value);
    const startTime1 = moment('07:00', 'HH:mm');
    const endTime1 = moment('10:00', 'HH:mm');
    const startTime2 = moment('14:00', 'HH:mm');
    const endTime2 = moment('18:00', 'HH:mm');

    if (
      (time.isBetween(startTime1, endTime1, 'minute', '[)')) || // 7 AM - 10 AM
      (time.isBetween(startTime2, endTime2, 'minute', '[)') // 2 PM - 5 PM
      )
    ){
      
        return Promise.resolve();
      
    } 
    return Promise.reject(new Error('Time must be between 7 AM - 10 AM or 14 PM - 18 PM!'));
  };

  const fetchSlots = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const response = await api.get('bookings/timeslots', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setSlots(response.data); 
    } catch (error) {
      toast.error('Error fetching slots:', error.response.data);
    }
  }

  const fetchServices = async () => {
    //Lấy dữ liệu từ be
    try {
      const response = await api.get('bookings/services', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      // const response = await axios.get(api);
      console.log(response.data)
      setServices(response.data);
    } catch (error) {
      toast.error('Error fetching services:', error.response.data);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchSlots();
  }, []);

  useEffect(() => {
    if (location.hash === '#booking') {
      window.scrollTo(90, 200);
    }

  }, [location]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      //request all information of this booking
      // form to booking detail and booking management
      try {
        const response = await api.post('bookings', values, {
          headers:
          {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        console.log('Booking submitted:', values);
        toast.success('Booking submitted successfully!');
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
    const slotId = e.target.value;
    console.log(slotId)
      // const [selectedSlot, selectedDoctorName] = selectedValue.split('|');
      setSelectedSlot(slotId);
      setValues(prevValues => ({
        ...prevValues,
        slotId: slotId,
      }));
      console.log(values)
      // setValues(prevValues => ({
      //   ...prevValues,
      //   slot: selectedSlot,
      //   doctor_name: selectedDoctorName
      // }));
      // setSlot(selectedSlot);
      // setSelectedDoctor(selectedDoctorName);
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setSelectedService(selectedService);
    if (selectedService) {
      const [serviceName, servicesDetailId, serviceTypeName] = selectedService.split(' || ');
      console.log('Selected Service:', serviceName, 'ServicesDetailId:', servicesDetailId);
      setValues(prevValues => ({
        ...prevValues,
        servicesDetailId: servicesDetailId
      }));
      
      // Assuming 'Online Consulting' is the name for interview services
      setIsInterviewService(serviceTypeName === 'Online');
    } else {
      setValues(prevValues => ({
        ...prevValues,
        servicesDetailId: ''
      }));
      setIsInterviewService(false);
    }
  }

  const handleDateTimeChange = (value) => {
    setSelectedDateTime(value);
    if (value) {
      const startTime = value.format('HH:mm');
      //2 để tiếng phỏng vấn online hoặc khám online
      const endTime = value.clone().add(2, 'hours').format('HH:mm');
      const slotDate = value.format('YYYY-MM-DD');
      
      setValues(prevValues => ({
        ...prevValues,
        time: {
          startTime: startTime,
          endTime: endTime,
          slotDate: slotDate,
        }
      }));
      
      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
      console.log('Slot Date:', slotDate);
    } else {
      setValues(prevValues => ({ 
        ...prevValues, 
        time: {},
      }));
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
            name='servicesDetailId'
            value={selectedService}
            onChange={handleServiceChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.servicesDetailId} value={`${service.serviceId.serviceName} || ${service.servicesDetailId} || ${service.serviceTypeId.service_typeName}`}>
                {service.serviceId.serviceName} - {service.serviceTypeId.service_typeName}
              </option>
            ))}
          </select>
        </div>
        {/* when I choose slot the docter name of this slot 
        will be set in handleSlotChange func to show in screen */}
        <div className="form-group-booking">
          <label htmlFor="slot">Slot:</label>
          {isInterviewService ? (
            <Form.Item
              name="dateTime"
              label="Select Date and Time"
              rules={[{ required: true, message: 'Please select the date and time!' },  { validator: validateTimeRange }]}
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
              name='slotId'
              // value={`${slot}|${selectedDoctor}`}
              value={selectedSlot}
              onChange={handleSlotChange}
              required
            >
              <option value="">Select a Slot</option>
              {slots.map((slot) => ( // Change this line
                <option key={slot.slotId} value={`${slot.slotId}`}>
                  {slot.startTime} - {slot.endTime} in {slot.slotDate}
                </option>
              ))}
            </select>
          )}
          {selectedDoctor && (
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