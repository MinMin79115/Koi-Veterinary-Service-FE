import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const PaySuccess = ({orderId}) => {
    const navigate = useNavigate();
  return (
    <Result
      status="success"
    title="Payment Successfully!"
    subTitle={`Order number: ${orderId}`}
    extra={[
      <Button type="primary" onClick={() => {
        navigate('/booking-history');
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