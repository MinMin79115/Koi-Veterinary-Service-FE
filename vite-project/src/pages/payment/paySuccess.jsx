import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import useParam from '../../hook/useParam';
const PaySuccess = () => {
  const params = useParam();
  const bookingId = params.getParam('bookingId');
  const amount = params.getParam('amount');
  const method = params.getParam('paymentMethod'); 
  const formatAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const navigate = useNavigate();
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