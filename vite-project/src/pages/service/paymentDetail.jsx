import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    // Retrieve booking details from sessionStorage
    const bookingId = sessionStorage.getItem('bookingId');
    const serviceName = sessionStorage.getItem('serviceName');
    const serviceTime = sessionStorage.getItem('serviceTime');
    const price = sessionStorage.getItem('price');
    const paymentUrl = sessionStorage.getItem('paymentUrl');

    setBookingDetails({
      bookingId: bookingId,
      serviceName: serviceName,
      serviceTime: serviceTime,
      price: price,
      paymentUrl: paymentUrl
    });
  }, []);

  const handlePayment = () => {
    if (bookingDetails.paymentUrl) {
      window.open(bookingDetails.paymentUrl, '_blank');
    } else {
      console.error('Payment URL is not available');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Booking Details</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Booking ID:</strong></div>
                <div className="col-sm-8">{bookingDetails.bookingId}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Service:</strong></div>
                <div className="col-sm-8">{bookingDetails.serviceName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Service Time:</strong></div>
                <div className="col-sm-8">{bookingDetails.serviceTime}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Price:</strong></div>
                <div className="col-sm-8">{bookingDetails.price}</div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-6">
                  <Button variant="success" className="w-100" onClick={handlePayment}>
                    Pay Now
                  </Button>
                </div>
                <div className="col-sm-6">
                  <Button variant="secondary" className="w-100" onClick={handleGoHome}>
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetail;
