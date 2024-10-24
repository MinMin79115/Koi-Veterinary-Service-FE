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
    veterinarianId: '',
    serviceTime: '',
  });
  const [totalPrice, setTotalPrice] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [selectedDateTime, setSelectedDateTime] = useState('')
  const [isInterviewService, setIsInterviewService] = useState(false)
  const [uniqueSlots, setUniqueSlots] = useState({});

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
      
      // Gộp 1 Slot chứa nhiều bác sĩ
      const processedSlots = response.data.reduce((acc, slot) => {
        const timeKey = `${slot.timeSlot.startTime} - ${slot.timeSlot.endTime}`;
        if (!acc[timeKey]) {
          acc[timeKey] = { doctors: [] };
        }
        acc[timeKey].doctors.push({
          id: slot.veterinarian.veterinarianId,
          name: slot.veterinarian.user.fullname,
          slotId: slot.slotId
        });
        return acc;
      }, {});
      
      setUniqueSlots(processedSlots);
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

  const fetchDoctors = async () => {
    //Lấy dữ liệu từ be - Doctor Online to pick
    try {
      const response = await api.get('bookings/veterinarians', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log(response.data)
      setDoctors(response.data);
    } catch (error) {
      toast.error('Error fetching doctors:', error.response.data);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchSlots();
    fetchDoctors();
    
  }, []);

  useEffect(() => {
    if (location.hash === '#booking') {
      window.scrollTo(90, 200);
    }

  }, [location]);

  //có send email
  const handleSubmit = async () => {
    const token = sessionStorage.getItem('token')
    console.log('Values to send:', valuesToSend);
    console.log(user.email);

    // Construct the email content
    const emailContent = `
      <html>
        <body>
          <h1 style='color: blue;'>Welcome, ${user.fullname}</h1>
          <p style='font-size: 16px;'>You have successfully booked an appointment.</p>
          <p style='font-size: 16px;'>Your service is: ${selectedService.split(' || ')[0]} will start at <i>${selectedHour} ${selectedDateTime}</i> <i>with ${selectedDoctor}</i>.</p>
          <p style='font-size: 16px;'>Thank you for choosing our service!</p>
        </body>
      </html>
    `;

    const format = {
      subject: "Booking Confirmation",
      body: emailContent
    };

    if (user && totalPrice) {
      try {   
          const response = await api.post('bookings', valuesToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
          
          const resMail = await api.post(`mail/send/${user.email}`, format, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
        console.log('Booking submitted:', response.data);
        console.log('Email sent: ', resMail)
        sessionStorage.setItem('bookingId', response.data.bookingId);
        sessionStorage.setItem('price', totalPrice);
        sessionStorage.setItem('serviceName', selectedService.split(' || ')[0]);
        sessionStorage.setItem('serviceTime', selectedDateTime);
        toast.success('Booking submitted successfully!');
        setSelectedService('');
        setSelectedSlot('');
        setSelectedDoctor('');
        setSelectedDateTime(''); // Reset selectedDateTime
        setSelectedHour('')
        setTimeSlot('')
        navigate('/payment-detail')
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data || 'An error occurred while booking');
      }
    } else {
      toast.error('Please login to book a service');
      navigate("/login");
    }
  };

  const handleSlotChange = (e) => {
    const [timeSlot, doctorInfo] = e.target.value.split('|');
    const [doctorId, doctorName, slotId] = doctorInfo.split(',');
    setTimeSlot(timeSlot);
    setSelectedHour(timeSlot);
    setSelectedSlot(slotId);
    console.log(selectedSlot);
    setSelectedDoctor(doctorName);
    setValuesToSend(prevValues => ({
      ...prevValues,
      slotId: slotId,
      veterinarianId: doctorId,
    }));
  };

  const handleDoctorChange = (e) => {
    const doctorChoose = e.target.value;
    setSelectedSlot('')
    console.log('Selected Doctor Value:', doctorChoose); // Log the selected value
    const [selectedDoctorId, name] = doctorChoose.split('|');
    console.log('Doctor ID:', selectedDoctorId, 'Doctor Name:', name); // Log the split values
    if (doctorChoose) {
      setSelectedDoctor(name); // Trim to remove any extra spaces
      setValuesToSend(prevValues => ({
        ...prevValues,
        slotId: selectedSlot,
        veterinarianId: selectedDoctorId // Use the ID for the value
      }));
    } else {
      setSelectedDoctor('');
      setValuesToSend(prevValues => ({
        ...prevValues,
        veterinarianId: ''
      }));
    }
  };

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    setSelectedService(selectedService);
    setSelectedSlot('')
    setSelectedDoctor('')
    setTimeSlot('')

    if (selectedService) {
      const [serviceName, servicesDetailId, serviceTypeName, totalPrice] = selectedService.split(' || ');
      setTotalPrice(totalPrice)
      console.log('Selected Service:', serviceName, 'ServicesDetailId:', servicesDetailId);
      setValuesToSend(prevValues => ({
        ...prevValues,
        servicesDetailId: servicesDetailId,
      }));
      // Assuming 'Online Consulting' is the name for interview services
      setIsInterviewService(serviceTypeName === 'Online' || serviceTypeName === 'At_Home');
      if(isInterviewService){
        setValuesToSend(prevValues => ({
          ...prevValues,
          slotId: selectedSlot,
        }));
      }
    } else {
      setValuesToSend(prevValues => ({
        ...prevValues,
        servicesDetailId: '',
      }));
      setTotalPrice('')
      setIsInterviewService(false);
    }
  }

  const handleDateTimeChange = (value) => {
    const timeForrmat = value.format('YYYY-MM-DD')
    if(value.format('HH:mm') === '00:00'){
      setSelectedHour('')
    }else{
      setSelectedHour(value.format('HH:mm'))
      setTimeSlot(value.format('HH:mm'))
    }
    setSelectedDateTime(timeForrmat);
    setSelectedSlot('')
    console.log(timeForrmat)
    if (timeForrmat) {
      // const startTime = value.format('HH:mm');
      // //2 để tiếng phỏng vấn online hoặc khám online
      const endTime = value.clone().add(2, 'hours').format('HH:mm');
      // const serviceTime = value.format('YYYY-MM-DD');

      setValuesToSend(prevValues => ({
        ...prevValues,
        slotId: selectedSlot,
        serviceTime: timeForrmat,
      }));

      // console.log('Start Time:', startTime);
      console.log('End Time:', endTime);
      // console.log('Slot Date:', serviceTime);
    } else {
      setValuesToSend(prevValues => ({
        ...prevValues,
        serviceTime: '',
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
                  <Form.Item>
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
                      <option key={service.servicesDetailId} value={`${service.serviceId.serviceName} || ${service.servicesDetailId} || ${service.serviceTypeId.service_type} || ${service.serviceTypeId.price}`}>
                        {service.serviceId.serviceName} - {service.serviceTypeId.service_type}
                      </option>
                    ))}
                  </select>
                  </Form.Item>
                </div>

                <div className="mb-3">
                  {isInterviewService && selectedService ? (
                    <>                
                    <label htmlFor="dateTime" className="form-label">Date and Time:</label>
                      <Form.Item
                        name="dateTime"
                        label="Select:"
                        rules={[
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
                      <label htmlFor="veterinarianId" className="form-label">Doctors:</label>
                      <div>
                      <Form.Item>
                        <select
                          id="veterinarianId"
                          name='veterinarianId'
                          value={doctors.fullname}
                          onChange={handleDoctorChange}
                          className="form-control"
                        >
                          <option value="">Select a Doctor</option>
                          {doctors.map((item) => (
                            <option key={item.veterinarianId} value={`${item.veterinarianId} | ${item.user.fullname}`}>
                              Doctor: {item.user.fullname}
                            </option>
                          ))}
                        </select>
                        </Form.Item>
                      </div>
                    </>
                  ) : selectedService ? (
                    <>
                    <label htmlFor="dateTime" className="form-label">Date:</label> 
                    <Form.Item
                        name="date"
                        label="Select:"
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          disabledDate={disabledDate}
                          onChange={handleDateTimeChange}
                          value={selectedDateTime}
                          className="form-control"
                        />
                      </Form.Item>
                    <Form.Item>
                      <label htmlFor="slot" className="form-label">Slot:</label>
                      <select
                        id="slot"
                        name='slotId'
                        onChange={handleSlotChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select a Slot</option>
                        {Object.entries(uniqueSlots).map(([timeSlot, data]) => (
                          <optgroup key={timeSlot} label={timeSlot}>
                            {data.doctors.map(doctor => (
                              <option 
                                key={`${timeSlot}-${doctor.id}`} 
                                value={`${timeSlot}|${doctor.id},${doctor.name},${doctor.slotId}`}
                              >
                              Dr. {doctor.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </Form.Item>
                    </>
                  ) : (
                    <></>
                  )}
                  
                </div>

                {timeSlot || selectedDoctor ? (
                  <div className="mb-3">
                      <div>
                        <label className="form-label">Selected time slot:</label>
                        <p className="form-control-static text-success fst-italic fs-6">{timeSlot}</p>
                      </div>
                      <div>
                        <label className="form-label">Your doctor:</label>
                        <p className="form-control-static text-success fst-italic fs-6">{selectedDoctor}</p>
                      </div>
                  </div>
                ) : null}

                <Form.Item>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="submit-btn"
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
