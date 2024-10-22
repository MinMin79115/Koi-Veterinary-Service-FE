import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingDetail.css';
import api from '../../config/axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BookingDetail = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchBooking = async () => {
    try {
      if (user.role === 'CUSTOMER') {
        const response = await api.get(`bookings/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        console.log(response.data);

        const values = response.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.user.fullname,
          email: booking.user.email,
          service: booking.servicesDetail.serviceId.serviceName,
          serviceType: booking.servicesDetail.serviceTypeId.service_type,
          status: booking.status,
          price: booking.servicesDetail.serviceTypeId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        }));

        setBookings(values); //Set bookings to an array of booking objects      
        }else{
        const response = await api.get(`bookings/veterinarian/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        console.log(response.data);

        const values = response.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.user.fullname,
          email: booking.user.email,
          service: booking.servicesDetail.serviceId.serviceName,
          serviceType: booking.servicesDetail.serviceTypeId.service_type,
          status: booking.status,
          price: booking.servicesDetail.serviceTypeId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        }));

        setBookings(values); //Set bookings to an array of booking objects
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: 'center',
      className: 'column-border'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      align: 'center',
      hidden: user?.role === 'VETERINARIAN' || user?.role === 'CUSTOMER'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '20%',
      align: 'center',
      className: 'column-border'
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: '30%',
      align: 'center',
      className: 'column-border'
    },
    {
      title: 'Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: '15%',
      align: 'center',
      className: 'column-border'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      className: 'column-border',
      render: (status) => (
        <span className={`badge ${status === 'PENDING' ? 'bg-warning' : status === 'COMPLETED' ? 'bg-info' : status === 'CANCELLED' ? 'bg-danger' : 'bg-success  '} d-flex justify-content-center py-2 fst-italic`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      align: 'center',
      className: 'column-border'
    },
    {
      title: 'Action',
      align: 'center',
      className: 'column-border',
      render: (_, record) => (
        <div className="d-flex flex-column flex-md-row justify-content-center">
          {user?.role === 'CUSTOMER' ? (
            record.status === "COMPLETED" ? (
              <p className='fst-italic fs-6 text-info'>HAS BEEN COMPLETED</p>
            ) : record.status === "CANCELLED" ? (
              <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
            ) : (
              <Button
                type='none'
                className="btn-custom btn btn-danger d-flex justify-content-center m-1"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteBooking(record)}
              >
                Delete
              </Button>
            )
          ) : (
            record.status === "COMPLETED" ? (
              <p className='fst-italic fs-6 text-info'>HAS BEEN COMPLETED</p>
            ) : record.status === "CANCELLED" ? (
              <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
            ) : (
              <Button
                type='none'
                icon={<FileDoneOutlined />}
                className="btn-custom btn btn-success d-flex justify-content-center m-1"
                onClick={() => handleComplete(record)}
              >
                Complete
              </Button>
            )
          )}
        </div>
      )
    }
  ];

  const handleDeleteBooking = async (record) => {
    try {
      const response = await api.put(`bookings/delete/${record.id}`,{
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      toast.success('Deleted successful.')
      fetchBooking()
    } catch (error) {
      console.log(error.response.data)
    }
  };

  const handleComplete = async (record) => {
    try {
      const valuesToUpdate = {
        status: 'COMPLETED'
      }
      const emailContent = `
    <html>
      <body>
        <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
        <p style='font-size: 16px;'>Your booking service has been completed.</p>
        <p style='font-size: 16px;'>Thank you for choosing our service!</p>
        <p style='font-size: 16px;'>If you have any questions, please contact us at <b>KOI FISH CARE Centre</b></p>
        <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
      </body>
    </html>
    `;
      const format = {
        subject: "Booking Completion",
        body: emailContent
      }
      const resMail = await api.post(`mail/send/${record.email}`, format, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      console.log(resMail)
      const response = await api.put(`bookings/${record.id}`, valuesToUpdate,{
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      //Update the booking status to COMPLETED
      //Need to send mail to customer (user.emai)
      console.log(resMail)
      toast.success('Complete successful.')
      fetchBooking()
    } catch (error) {
      console.log(error.response.data)
    }
  };

  const filteredBookings = bookings.filter(booking => booking.status !== '');

  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4 text-center fw-bold">Booking Detail</h2>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  dataSource={filteredBookings}
                  columns={columns}
                  pagination={{ pageSize: 6 }}
                  className="table column-border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
