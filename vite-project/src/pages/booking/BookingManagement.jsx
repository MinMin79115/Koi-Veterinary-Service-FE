import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingManagement.css';
import api from '../../config/axios'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const BookingPage = () => {
    const user = useSelector(state => state.user);
    const token = user.accessToken;
    const [bookings, setBookings] = useState([]);
    const [bills, setBills] = useState([]);
    const [showCancelled, setShowCancelled] = useState(false);


    const fetchBill = async () => {
        try {
            const response = await api.get('payment', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const values = response.data.map(bill => ({
                id: bill.booking.bookingId,
            }));
            setBills(values);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchBooking = async () => {
        try {
            const response = await api.get('bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            const values = response.data.map(booking => ({
                id: booking.bookingId,
                customerName: booking.user.fullname,
                veterinarian: booking.veterinarian?.user.fullname,
                email: booking.user?.email,
                service: booking.servicesDetail?.serviceId?.serviceName,
                serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
                status: booking.status,
                price: booking.servicesDetail?.serviceTypeId?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            }));

            setBookings(values); // Set bookings to an array of booking objects
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBooking();
        fetchBill();
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
            className: 'column-border',
            hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN' || user?.role === 'STAFF'
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
            width: '20%',
            align: 'center',
            className: 'column-border'
        },
        {
            title: 'Veterinarian',
            dataIndex: 'veterinarian',
            key: 'veterinarian',
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
                        <p className='fst-italic text-info'>COMPLETED</p>
                    ) : record.status === "CONFIRMED" ? (
                        <p className='fst-italic text-success'> CONFIRMED</p>
                    ) : record.status === "CANCELLED" ? (
                        <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
                    ) : record.status === "PENDING" && bills.some(bill => bill.id === record.id) ? (
                        <Button
                            type='none'
                            className="btn-custom btn btn-success d-flex justify-content-center m-1"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleConfirmBooking(record)}
                        >
                            Confirm
                        </Button>
                    ) : (
                        <Popconfirm
                            title="Are you sure you want to delete this booking?"
                            onConfirm={() => handleDeleteBooking(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button 
                                type="primary" 
                                danger 
                                icon={<DeleteOutlined />} 
                                className="m-1"
                            >
                                Delete
                                </Button>
                        </Popconfirm>
                    )}
                </div>
            )
        }
    ];


    const handleConfirmBooking = async (record) => {
        const URLMeet = "https://meet.google.com/fgy-kvct-gtf"
        const valuesToSend = {
            status: "CONFIRMED"
        }
        const emailContentOnline = `
        <html>
          <body>
            <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
            <p style='font-size: 16px;'>Your booking service has been confirmed.</p>
            <p style='font-size: 16px;'>Your link Google Meet here: ${URLMeet}</p>
            <p style='font-size: 16px;'>Thank you for choosing our service!</p>
            <p style='font-size: 16px;'>If you have any questions, please contact us at <b>KOI FISH CARE Centre</b></p>
            <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
          </body>
        </html>
        `;
        const emailContent = `
        <html>
          <body>
            <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
            <p style='font-size: 16px;'>Your booking has been confirmed at time: ${new Date().toLocaleString()}.</p>
            <p style='font-size: 16px;'>Thank you for choosing our service!</p>
            <p style='font-size: 16px;'>If you have any questions, please contact us at <b>KOI FISH CARE Centre</b></p>
            <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
          </body>
        </html>
        `;
        const format = {
            subject: "Booking Confirmation",
            body: emailContent
        }

        const formatOnline = {
            subject: "Booking Completion",
            body: emailContentOnline
        }
        try {
            const response = await api.put(`bookings/${record.id}`, valuesToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Confirmed.')
            fetchBooking();
        } catch (error) {
            console.log(error)
        } finally {
            if (record.serviceType === "Online") {
                const resMail = await api.post(`mail/send/${record.email}`, formatOnline, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Email sent: ', resMail)
            } else {
                const resMail = await api.post(`mail/send/${record.email}`, format, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Email sent: ', resMail)
            }

        }

    };

    const handleDeleteBooking = async (record) => {
       
        const emailContent = `
            <html>
              <body>
                <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
                <p style='font-size: 16px;'>Your booking has been cancelled at time: ${new Date().toLocaleString()}.</p>
                <p style='font-size: 16px;'>If you have any questions, please contact us at <b>KOI FISH CARE Centre</b></p>
                <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
              </body>
            </html>
            `;
        const format = {
            subject: "Booking Deletion",
            body: emailContent
        }
        try {
            await api.put(`bookings/delete/${record.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Delete successful.')
            fetchBooking();
        } catch (error) {
            console.log(error)
        } finally {
            const resMail = await api.post(`mail/send/${record.email}`, format, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('Email sent: ', resMail)
        }
    };

    const filteredBookings = bookings
        .filter(booking => showCancelled ? booking.status === "CANCELLED" : booking.status !== "CANCELLED")
        .slice(showCancelled ? 10 : 0)
        .sort((a, b) => b.id - a.id)
    return (
        <div className="container-fluid mt-5">
            <h2 className="mb-4 text-center mt-5">Booking Management</h2>
            <div className="container bg-white rounded-3 p-3">
                <div className="d-flex justify-content-end mb-3 py-2">
                                <Button
                                    type={showCancelled ? "primary" : "default"}
                                    onClick={() => setShowCancelled(!showCancelled)}
                                    className="mb-3"
                                >
                                    {showCancelled ? "Show Active Bookings" : "Show Cancelled Bookings"}
                                </Button>
                            </div>
                                <Table
                                    dataSource={filteredBookings}
                                    columns={columns}
                                    pagination={{ pageSize: 6 }}
                                    className="table "
                                />
                        </div>
                    </div>
    );
};

export default BookingPage;
