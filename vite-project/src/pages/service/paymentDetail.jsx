import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaHome, FaCreditCard } from 'react-icons/fa';
import api from '../../config/axios';
function PaymentDetail() {
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    serviceName: '',
    serviceTime: '',
    price: '',
    paymentUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = sessionStorage.getItem('bookingId');
    const serviceName = sessionStorage.getItem('serviceName');
    const serviceTime = sessionStorage.getItem('serviceTime');
    const price = sessionStorage.getItem('price');

    setBookingDetails({
      bookingId: bookingId,
      serviceName: serviceName,
      serviceTime: serviceTime,
      price: price,
    });
  }, []);

  const handlePayment = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const resPayment = await api.get(`payment/vnpay?amount=${bookingDetails.price}&bankCode=NCB&bookingId=${bookingDetails.bookingId}`, {
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
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-light text-white text-center py-4">
              <div className="text-center mb-4">
                <FaCheckCircle className="text-success" size={50} />
              </div>
              <h3 className="mb-0 font-weight-bold">Booking Confirmation</h3>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="row mb-3">
                  <div className="col-sm-6 font-weight-bold">Booking ID:</div>
                  <div className="col-sm-6">{bookingDetails.bookingId}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 font-weight-bold">Service:</div>
                  <div className="col-sm-6">{bookingDetails.serviceName}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 font-weight-bold">Service Time:</div>
                  <div className="col-sm-6">{bookingDetails.serviceTime}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-6 font-weight-bold">Price:</div>
                  <div className="col-sm-6">{bookingDetails.price}</div>
                </div>
              </div>
              <div className="d-flex justify-content-around">
                <button className="btn btn-primary btn-lg " onClick={handlePayment}>
                  <FaCreditCard className="me-2" /> Pay Now
                </button>
                <button className="btn btn-secondary btn-lg " onClick={handleGoHome}>
                  <FaHome className="me-2" /> Go to Home
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
