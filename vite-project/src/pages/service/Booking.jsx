import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { booking } from '../../redux/features/bookingSlider';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingPage  = () => {
  const user = useSelector(state => state.user);
  const token = user.accessToken; 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
  
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [groupedServices, setGroupedServices] = useState({});

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
      const response = await api.get('bookings/timeslots', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
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
      toast.error('Error fetching slots:', error);
    }
  }

  const fetchServices = async () => {
    try {
      const response = await api.get('bookings/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      
      // Group services by serviceName
      const grouped = response.data.reduce((acc, service) => {
        const serviceName = service.serviceId.serviceName;
        if (!acc[serviceName]) {
          acc[serviceName] = [];
        }
        acc[serviceName].push(service);
        return acc;
      }, {});
      
      setGroupedServices(grouped);
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
          Authorization: `Bearer ${token}`
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

  }, [location]);

  //có send email
  const handleSubmit = async () => {
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
          <p style='font-size: 16px;'>Please proceed to the payment page to complete your booking.</p>
          <p style='font-size: 16px;'>Best regards,</p>
          <p style='font-size: 16px;'>The KOI FISH CARE Team</p>
          </body>
      </html>
    `;

    const format = {
      subject: "Booking Successful",
      body: emailContent
    };

    if (user && totalPrice) {
      try {   
          const response = await api.post('bookings', valuesToSend, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Booking submitted:', response.data);
        dispatch(booking(response.data))
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
      } finally {
        const resMail = await api.post(`mail/send/${user.email}`, format, {
          headers: {
              Authorization: `Bearer ${token}`
          }
        });
        console.log('Email sent: ', resMail)
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

  const handleServiceNameChange = (e) => {
    const serviceName = e.target.value;
    setSelectedServiceName(serviceName);
    setSelectedServiceType('');
    setSelectedService('');
  }

  const handleServiceTypeChange = (e) => {
    const selectedService = e.target.value;
    setSelectedServiceType(selectedService);
    setSelectedService(selectedService);
    handleServiceChange({ target: { value: selectedService } });
  }

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
                {/* Service Name */}
                <div className="mb-3">
                  <label htmlFor="serviceName" className="form-label">Service Name:</label>
                  <Form.Item>
                    <select
                      id="serviceName"
                      value={selectedServiceName}
                      onChange={handleServiceNameChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select a service</option>
                      {Object.keys(groupedServices).map((serviceName) => (
                        <option key={serviceName} value={serviceName}>
                          {serviceName}
                        </option>
                      ))}
                    </select>
                  </Form.Item>
                </div>
                {/* Service Type */}
                <div className="mb-3">
                    <label htmlFor="serviceType" className="form-label">Service Type:</label>
                    <Form.Item>
                      <select
                        id="serviceType"
                        value={selectedServiceType}
                        onChange={handleServiceTypeChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select a service type</option>
                        {groupedServices[selectedServiceName]?.map((service) => (
                          <option 
                            key={service.servicesDetailId} 
                            value={`${service.serviceId.serviceName} || ${service.servicesDetailId} || ${service.serviceTypeId.service_type} || ${service.serviceTypeId.price}`}
                          >
                            {service.serviceTypeId.service_type}
                          </option>
                        ))}
                      </select>
                    </Form.Item>
                </div>
                {/* Date and Time */}
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

export default BookingPage;

