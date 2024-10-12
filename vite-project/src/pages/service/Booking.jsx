import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

const Booking = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [slots, setSlots] = useState([]); // Change this line
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('')
  const [valuesToSend, setValuesToSend] = useState({
    servicesDetailId: '',
    slotId: '',
  });
  const [isInterviewService, setIsInterviewService] = useState(false)
  //Hàm validate chọn time
  const validateTimeRange = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please select the date and time!'));
    }

    const time = value.format('HH:mm');

    const startTime1 = '07:00';
    const endTime1 = '10:00';
    const startTime2 = '14:00';
    const endTime2 = '18:00';

    if (
      (time >= startTime1 && time <= endTime1) || // 7 AM - 10 AM
      (time >= startTime2 && time <= endTime2) // 2 PM - 6 PM (inclusive)
    ) {
      
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Time must be between 7 AM - 10 AM or 2 PM - 6 PM!'));
    }
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


  const handleSubmit = async (values) => {
    console.log('Values to send:', valuesToSend);
    if (user) {
      try {
        const response = await api.post('bookings',valuesToSend, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        console.log('Booking submitted:', response.data);
        toast.success('Booking submitted successfully!');
        setSelectedService('');
        setSelectedSlot('');
        navigate("/booking-detail");
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data || 'An error occurred while booking');
      }
    } else {
      toast.error('Please login to book a service');
      navigate("/login");
    }
  };

  const handleSlotChange = (e) => {
    const slotChoose = e.target.value;
    console.log(slotChoose)
      // const [selectedSlot, selectedDoctorName] = selectedValue.split('|');
    
    if(slotChoose){
      setSelectedSlot(slotChoose)
      setValuesToSend(prevValues => ({
        ...prevValues,
        slotId: slotChoose
      }));
    }else{
      setValuesToSend(prevValues => ({
        ...prevValues,
        slotId: ''
      }));
    }
    console.log(valuesToSend)
      
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
      setValuesToSend(prevValues => ({
        ...prevValues,
        servicesDetailId: servicesDetailId
      }));
      // Assuming 'Online Consulting' is the name for interview services
      setIsInterviewService(serviceTypeName === 'Online');
    } else {
      setValuesToSend(prevValues => ({
        ...prevValues,
        servicesDetailId: ''
      }));
      setIsInterviewService(false);
    }
  }

  const handleDateTimeChange = (value) => {
    const timeForrmat = value.format('YYYY-MM-DD HH:mm:ss')
    setSelectedDateTime(timeForrmat);
    console.log(timeForrmat)
    if (timeForrmat) {
      // const startTime = value.format('HH:mm');
      // //2 để tiếng phỏng vấn online hoặc khám online
      const endTime = value.clone().add(2, 'hours').format('HH:mm');
      // const slotDate = value.format('YYYY-MM-DD');
      
      setValuesToSend(prevValues => ({
        ...prevValues,
        slot_id: 12,
        booking_time: timeForrmat,
      }));
      
      // console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
      // console.log('Slot Date:', slotDate);
    } else {
      setValuesToSend(prevValues => ({ 
        ...prevValues, 
        booking_time: '',
      }));
    }
  };

  const disabledDate = (current) => {
    // Can't select days before today and today
    return current && current < moment().endOf('day');
  };

  return (
    <div className="my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-8">
          <div className="px-3 py-auto shadow p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h2 className="text-center mb-4">Book a Service</h2>
              <Form onFinish={handleSubmit} className="booking-form">
                <div className="mb-3">
                  <label htmlFor="service" className="form-label">Services:</label>
                  <select
                    id="service"
                    name='servicesDetailId'
                    value={selectedService}
                    onChange={handleServiceChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.servicesDetailId} value={`${service.serviceId.serviceName} || ${service.servicesDetailId} || ${service.serviceTypeId.service_typeName}`}>
                        {service.serviceId.serviceName} - {service.serviceTypeId.service_typeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="slot" className="form-label">Slot:</label>
                  {isInterviewService ? (
                    <Form.Item
                      name="dateTime"
                      label="Select Date and Time"
                      rules={[
                        { required: true, message: 'Please select the date and time!' },
                        { validator: validateTimeRange }
                      ]}
                    >
                      <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={disabledDate}
                        onChange={handleDateTimeChange}
                        value={selectedDateTime}
                        className="form-control"
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item>
                      <select
                      id="slot"
                      name='slotId'
                      value={selectedSlot}
                      onChange={handleSlotChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select a Slot</option>
                      {slots.map((slot) => (
                        <option key={slot.slotId} value={`${slot.slotId}`}>
                          {slot.startTime} - {slot.endTime} on {slot.slotDate}
                        </option>
                      ))}
                    </select>
                    </Form.Item>
                  )}
                </div>

                {/* {selectedDoctor && (
                  <div className="mb-3">
                    <label className="form-label">Your doctor:</label>
                    <p className="form-control-static">{selectedDoctor}</p>
                  </div>
                )} */}

                <Form.Item>
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={!selectedService || (!isInterviewService && !selectedSlot) || (isInterviewService && !selectedDateTime)}
                  >
                    Book Now
                  </button>
                </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;