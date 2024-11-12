import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
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
<<<<<<< Updated upstream
=======
    const [showCancelled, setShowCancelled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const hours = sessionStorage.getItem('hours');
    const [options, setOptions] = useState([]);
    const labelRender = (props) => {
        const { label, value } = props;
        if (label) {
            return value;
        }
        return <span>Select Veterinarian</span>;
    };

    const fetchDoctor = async () => {
        try {
            const response = await api.get('veterinarian', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const values = response.data.filter(doc => doc.state === 'ONLINE').map(doc => ({
                label: doc.user.fullname,
                value: doc.veterinarianId
            }));
            setOptions(values);
            console.log(values)
        } catch (error) {
            console.log(error)
        }
    }
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                veterinarian: booking.veterinarian.user.fullname,
                email: booking.user.email,
                service: booking.servicesDetail.serviceId.serviceName,
                serviceType: booking.servicesDetail.serviceTypeId.service_type,
=======
                veterinarian: booking.veterinarian?.user.fullname,
                veterinarianEmail: booking.veterinarian?.user.email,
                email: booking.user?.email,
                service: booking.servicesDetail?.serviceId?.serviceName,
                serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
>>>>>>> Stashed changes
                status: booking.status,
                price: booking.servicesDetail.serviceTypeId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            }));

            setBookings(values); // Set bookings to an array of booking objects
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        fetchBooking();
        fetchBill();
    }, []);


<<<<<<< Updated upstream
=======
    useEffect(() => {
        // Check for expired bookings and show toast notification
        let checkBooking = false;
        bookings.forEach(booking => {
            if (isBookingExpired(booking)) {
                checkBooking = true;
            }
        });
        if (checkBooking) {
            toast.warning(`Have some booking is expired! (Over 10 minutes not paid)`, {
                position: "top-center",
                autoClose: true,
            })
            return;
        }
    }, [bookings]);

    // Add this function to check if a booking is expired (over 10 minutes old)
    const isBookingExpired = (booking) => {
        if (booking.status !== 'PENDING' || booking.isPaid) return false;

        const bookingDate = new Date(booking.createdAt);
        const currentDate = new Date();
        const diffInMinutes = Math.floor((currentDate - bookingDate) / (1000 * 60));

        return diffInMinutes > 12;
    };
>>>>>>> Stashed changes

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
                    ) : record.status === "PENDING" && bills.some(bill => bill.id === record.id) ? (
                        <Button
                            type='none'
                            className="btn-custom btn btn-success d-flex justify-content-center m-1"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleConfirmBooking(record)}
                        >
                            Confirm
                        </Button>
                    ) : record.status === "CANCELLED" ? (
                        <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
                    ) : (
                        <>
                        <Button
                            type='none'
                            className="btn-custom btn btn-danger d-flex justify-content-center m-1"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteBooking(record)}
                        >
                            Delete
                        </Button>
                        </>
                    )}
                </div>
            )
        }
    ];


    const handleConfirmBooking = async (record) => {
<<<<<<< Updated upstream
=======
        const URLMeet = "https://meet.google.com/fgy-kvct-gtf"
        sessionStorage.setItem('meeting-link', URLMeet)
>>>>>>> Stashed changes
        const valuesToSend = {
            status: "CONFIRMED"
        }
<<<<<<< Updated upstream
=======
        const emailContentOnline = `
        <html>
          <body>
            <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
            <p style='font-size: 16px;'>Your booking service has been confirmed.</p>
            <p style='font-size: 16px;'>Your link Google Meet here: ${URLMeet} start at ${hours}</p>
            <p style='font-size: 16px;'>Thank you for choosing our service!</p>
            <p style='font-size: 16px;'>If you have any questions, please contact us at <b>KOI FISH CARE Centre</b></p>
            <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
          </body>
        </html>
        `;
        const emailContentOnlineVeterinarian = `
        <html>
          <body>
            <h1 style='color: blue;'>Welcome, ${record.veterinarian}</h1>
            <p style='font-size: 16px;'>Your booking service has been confirmed.</p>
            <p style='font-size: 16px;'>Your link Google Meet here: ${URLMeet} start at ${hours} </p>
            <p style='font-size: 16px;'>Best regards, <b>KOI FISH CARE Centre</b></p>
          </body>
        </html>
        `;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

        const formatOnline = {
            subject: "Booking Confirmation",
            body: emailContentOnline
        }
        const formatOnlineVeterinarian = {
            subject: "Booking Confirmation",
            body: emailContentOnlineVeterinarian
        }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
            if (record.serviceType === "Online") {
                const resMail = await api.post(`mail/send/${record.email}`, formatOnline, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const resMailVeterinarian = await api.post(`mail/send/${record.veterinarianEmail}`, formatOnlineVeterinarian, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Email sent: ', resMail)
                console.log('Email sent: ', resMailVeterinarian)
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
>>>>>>> Stashed changes
            const resMail = await api.post(`mail/send/${record.email}`, format, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('Email sent: ', resMail)
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
            const response = await api.put(`bookings/delete/${record.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Delete successful.')
            fetchBooking();
        } catch (error) {
            console.log(error.response.data)
        }finally{
            const resMail = await api.post(`mail/send/${record.email}`, format, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('Email sent: ', resMail)
        }
    };

    const bookingsSorted = bookings.sort((a, b) => b.id - a.id);

    return (
<<<<<<< Updated upstream
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <h2 className="mb-4 text-center">Booking Management</h2>
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table
                                    dataSource={bookingsSorted}
                                    columns={columns}
                                    pagination={{ pageSize: 6 }}
                                    className="table "
                                />
                            </div>
                        </div>
=======
        <div className="container-fluid margin-booking">
            <h2 className="page-title text-center mt-5">Booking Management</h2>
            <div className="booking-controls mb-4">
                <Space size="middle" className="w-100 justify-content-between align-items-center">
                    <div className="search-section d-flex gap-3">
                        <Input
                            placeholder="Search by service name..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            allowClear
                        />
                        <Select
                            defaultValue="ALL"
                            onChange={(value) => setStatusFilter(value)}
                            className="status-select"
                            style={{ minWidth: 120 }}
                            disabled={showCancelled}
                        >
                            <Option value="ALL">All Status</Option>
                            <Option value="PENDING">Pending</Option>
                            <Option value="CONFIRMED">Confirmed</Option>
                            <Option value="COMPLETED">Completed</Option>
                        </Select>
>>>>>>> Stashed changes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
