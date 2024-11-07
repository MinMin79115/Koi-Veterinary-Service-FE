import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import useParam from '../../hook/useParam';
import { useDispatch } from 'react-redux';
import { bookingReset } from '../../redux/features/bookingSlider';
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
    <Result
    status="success"
    title="Payment Successfully!"
    subTitle={`BookingNo: ${bookingId} , Amount: ${formatAmount} , Payment Method: ${method}`}
    extra={[
      <Button type="primary" onClick={() => {
        navigate('/booking-detail');
      }}>
        Go To Booking History
      </Button>,
      <Button onClick={() => {
        navigate('/');
      }}>Go To Home</Button>,
    ]}
  />
);
}
export default PaySuccess;