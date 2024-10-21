import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import useParam from '../../hook/useParam';
const PaySuccess = () => {
  const params = useParam();
  const orderInfo = params.getParam('vnp_OrderInfo');
  const orderNo = params.getParam('vnp_TransactionNo');
  const navigate = useNavigate();
  return (
    <Result
      status="success"
    title="Payment Successfully!"
    subTitle={`BookingNo: ${orderNo} , ${orderInfo}`}
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