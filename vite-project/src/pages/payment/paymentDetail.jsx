import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaHome, FaCreditCard } from 'react-icons/fa';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
function PaymentDetail() {
  const booking = useSelector(state => state.booking);
  const token = useSelector(state => state.user.accessToken);
  console.log(token)
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    serviceName: '',
    serviceTime: '',
    price: '',
    paymentUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = booking.bookingId;
    const serviceName = booking.servicesDetail.serviceId.serviceName;
    const serviceTime = booking.serviceTime;
    const price = booking.servicesDetail.serviceTypeId.price;

    setBookingDetails({
      bookingId: bookingId,
      serviceName: serviceName,
      serviceTime: serviceTime,
      price: price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    });
  }, []);

  const handlePayment = async () => {
    try {
      const priceValue = parseFloat(bookingDetails.price.replace(/[^\d,]/g, '').replace(',', '.'));
      
      if (isNaN(priceValue)) {
        throw new Error('Invalid price format');
      }

      // Convert to smallest currency unit (e.g., cents)
      const amount = Math.round(priceValue);
      const resPayment = await api.get(`payment/vnpay?amount=${amount}&bankCode=NCB&bookingId=${bookingDetails.bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      window.open(resPayment.data.data.paymentUrl, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoHome = () => {
    navigate('/booking-detail');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-12">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-light text-white text-center py-4">
              <div className="text-center mb-4">
                <FaCheckCircle className="text-success" size={50} />
              </div>
              <h3 className="mb-0 font-weight-bold">Booking Information</h3>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="row mb-3">
                  <div className="col-sm-4 col-md-2" style={{fontWeight: 'bold'}}>Booking ID:</div>
                  <div className="col-sm-4 col-md-4">{bookingDetails.bookingId}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 col-md-2" style={{fontWeight: 'bold'}}>Service:</div>
                  <div className="col-sm-4 col-md-4">{bookingDetails.serviceName}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 col-md-2" style={{fontWeight: 'bold'}}>Service Time:</div>
                  <div className="col-sm-4 col-md-4">{bookingDetails.serviceTime}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 col-md-2" style={{fontWeight: 'bold'}}>Price:</div>
                  <div className="col-sm-4 col-md-4">{bookingDetails.price}</div>
                </div>
              </div>
              <div className="d-flex justify-content-around">
                <button className="btn btn-primary btn-lg " onClick={handlePayment}>
                  <FaCreditCard className="me-2" /> Pay Now
                </button>
                <button className="btn btn-secondary btn-lg " onClick={handleGoHome}>
                  <FaHome className="me-2" /> Go to History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetail;
