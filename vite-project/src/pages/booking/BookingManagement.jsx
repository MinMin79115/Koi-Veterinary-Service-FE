import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingManagement.css';
import api from '../../config/axios'
import { toast } from 'react-toastify';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBooking = async () => {      
        try {
          const response = await api.get('bookings', {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
          });
          console.log(response.data);
          
          const values = response.data.map(booking => ({
            id: booking.bookingId,
            customerName: booking.user.fullname,
            service: booking.servicesDetail.serviceId.serviceName,
            serviceType: booking.servicesDetail.serviceTypeId.service_type,
            status: booking.status,
            price: booking.servicesDetail.serviceTypeId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          }));
    
          setBookings(values); // Set bookings to an array of booking objects
        } catch (error) {
          toast.error("Fetching booking failed.");
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            align: 'center',
            className: 'column-border',
            render: (status) => (
                <span className={`badge ${status === 'PENDING' ? 'bg-warning' : status === 'CONFIRMED' ? 'bg-success' : status === 'COMPLETED' ? 'bg-info' : 'bg-danger'} d-flex justify-content-center py-2 fst-italic`}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Action',
            align: 'center',
            className: 'column-border',
            render: (_, record) => (
                <div className="d-flex flex-column flex-md-row justify-content-center">
                    {record.status === "COMPLETED" ? (
                        <p className='fst-italic text-info'>HAS BEEN COMPLETED</p>
                    ) : record.status === "CONFIRMED" ? (
                        <Button 
                        type='none'
                        className="btn-custom btn btn-danger d-flex justify-content-center m-auto"
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteBooking(record)}
                    >
                        Delete
                    </Button>
                    ) : record.status === "PENDING" ? (
                        <>
                        <Button 
                        type='none'
                        className="btn-custom btn btn-success d-flex justify-content-center m-1" 
                        icon={<CheckCircleOutlined />} 
                        onClick={() => handleConfirmBooking(record)}
                    >
                        Confirm
                    </Button>
                    <Button 
                        type='none'
                        className="btn-custom btn btn-danger d-flex justify-content-center m-1"
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteBooking(record)}
                    >
                        Delete
                    </Button>
                    </>
                    ) : (
                        <></>
                    )}
                </div>
            )
        }
    ];

   
    const handleConfirmBooking = async (record) => {
        const valuesToSend = {
            status: "CONFIRMED"
        }
        try{
            const response = await api.put(`bookings/${record.id}`,valuesToSend, {
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
              });
            toast.success('Confirmed.')
            fetchBooking();
        }catch(error){
            console.log(error)
        }
    };

    const handleDeleteBooking = async (record) => {
        try{
            const response = await api.put(`bookings/delete/${record.id}`, {
                headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
              });
            toast.success('Deleted successful.')
            fetchBooking();
        }catch(error){
            console.log(error.response.data)
        }
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <h2 className="mb-4 text-center">Booking Management</h2>
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table 
                                    dataSource={bookings} 
                                    columns={columns} 
                                    pagination={{ pageSize: 6}}
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

export default BookingPage;
