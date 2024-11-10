import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import useParam from '../../hook/useParam';
import { useDispatch } from 'react-redux';
import { bookingReset } from '../../redux/features/bookingSlider';
import './payment.css'
const PaySuccess = () => {
  const params = useParam();
  const bookingId = params.getParam('bookingId');
  const amount = params.getParam('amount');
  const method = params.getParam('paymentMethod'); 
  const formatAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(bookingReset());
  }, []);
  return (
    <div className='payment-success-container'>
    <Result
    className='payment-success-result'
    status="success"
    title="Payment Successfully!"
    subTitle={ <span style={{color: 'black'}}>BookingNo: {bookingId? bookingId : 'null'} , Amount: {formatAmount} , Payment Method: {method? method : 'null'}</span>}
    extra={[
      <button className='btn btn-primary' onClick={() => {
        navigate('/booking-detail');
      }}>
        Go To Booking History
      </button>,
      
      <button className='btn btn-secondary' onClick={() => {
        navigate('/');
      }}>
        Go To Home
      </button>,
    ]}
    />
    </div>
  );
}
export default PaySuccess;