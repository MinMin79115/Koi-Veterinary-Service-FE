import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Input, Select, Space } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingManagement.css';
import api from '../../config/axios'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const { Option } = Select;

const BookingPage = () => {
    const user = useSelector(state => state.user);
    const token = user.accessToken;
    const [bookings, setBookings] = useState([]);
    const [bills, setBills] = useState([]);
    const [showCancelled, setShowCancelled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [options, setOptions] = useState([]);
    const startHours = sessionStorage.getItem('hours');
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

            const values = response.data.map(booking => ({
                id: booking.bookingId,
                veterinarianId: booking.veterinarian?.veterinarianId,
                customerName: booking.user.fullname,
                veterinarian: booking.veterinarian?.user.fullname,
                veterinarianEmail: booking.veterinarian?.user.email,
                email: booking.user?.email,
                service: booking.servicesDetail?.serviceId?.serviceName,
                serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
                status: booking.status,
                price: booking.servicesDetail?.serviceTypeId?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
                createdAt: booking.bookingTime,
                isPaid: bills.some(bill => bill.id === booking.bookingId)
            }));

            setBookings(values); // Set bookings to an array of booking objects
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBooking();
        fetchBill();
        fetchDoctor();
    }, []);


    useEffect(() => {
        // Check for expired bookings and show toast notification
        let checkBooking = false;
        bookings.forEach(booking => {
            if (isBookingExpired(booking)) {
                checkBooking = true;
            }
        });
        if (checkBooking) {
            toast.warning(`Have some booking is expired! (Over 5 minutes not paid)`, {
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
            title: 'Veterinarian ID',
            dataIndex: 'veterinarianId',
            key: 'veterinarianId',
            width: '10%',
            align: 'center',
            className: 'column-border',
            hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN' || user?.role === 'STAFF'
        },
        {
            title: 'Email Veterinarian',
            dataIndex: 'VeterinarianEmail',
            key: 'VeterinarianEmail',
            width: '20%',
            align: 'center',
            className: 'column-border',
            hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN' || user?.role === 'STAFF'
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
            className: 'column-border',
            render: (_, record) => (
                record?.veterinarian ? record?.veterinarian : (
                    <Select
                        labelRender={labelRender}
                        defaultValue="-1"
                        style={{
                            width: '100%',
                        }}
                        options={options}
                        onChange={(value) => handleChangeVeterinarian(value, record)}
                        allowClear
                    />
                )
            )
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
            render: (status, record) => (
                <div>
                    <span className={`badge ${status === 'PENDING' ? 'bg-warning' :
                            status === 'CONFIRMED' ? 'bg-success' :
                                status === 'COMPLETED' ? 'bg-info' :
                                    'bg-danger'
                        } d-flex justify-content-center py-2 fst-italic`}>
                        {status}
                    </span>
                    {isBookingExpired(record) && (
                        <div className="expired-warning mt-1">
                            <span className="text-danger fw-bold">
                                Expired
                            </span>
                        </div>
                    )}
                </div>
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

    const handleChangeVeterinarian = async (value, record) => {
        if (!value) return;
        const valuesToSend = {
            veterinarianId: value
        }
        try {
            const response = await api.put(`bookings/${record.id}`, valuesToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchBooking();
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }


    const handleConfirmBooking = async (record) => {
        const URLMeet = "https://meet.google.com/fgy-kvct-gtf"
        sessionStorage.setItem('meeting-link', URLMeet);
        const valuesToSend = {
            status: "CONFIRMED",
            veterinarianId: record.veterinarianId
        }
        const emailContentOnline = `
        <html>
          <body>
            <h1 style='color: blue;'>Welcome, ${record.customerName}</h1>
            <p style='font-size: 16px;'>Your booking service has been confirmed.</p>
            <p style='font-size: 16px;'>Your link Google Meet here: ${URLMeet} start at ${startHours}</p>
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
            <p style='font-size: 16px;'>Your link Google Meet here: ${URLMeet} start at ${startHours}</p>
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
        const formatOnlineVeterinarian = {
            subject: "Booking Completion",
            body: emailContentOnlineVeterinarian
        }
        try {
            await api.put(`bookings/${record.id}`, valuesToSend, {
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
                const resMailVet = await api.post(`mail/send/${record.VeterinarianEmail}`, formatOnlineVeterinarian, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('Email sent: ', resMail)
                console.log('Email sent: ', resMailVet)
                
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

    const getFilteredAndSortedBookings = () => {
        let filtered = [...bookings];

        // Filter by service name
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.service?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        } else {
            // Filter cancelled bookings
            filtered = filtered.filter(booking =>
                showCancelled ? booking.status === "CANCELLED" : booking.status !== "CANCELLED"
            );
        }

        // Sort by booking ID
        filtered.sort((a, b) => {
            if (sortOrder === 'latest') {
                return b.id - a.id;
            } else {
                return a.id - b.id;
            }
        });

        return filtered;
    };

    return (
        <div className="container-fluid mt-5">
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
                    </div>
                    <div className="filter-section">
                        <Select
                            defaultValue="latest"
                            onChange={(value) => setSortOrder(value)}
                            className="sort-select me-3"
                        >
                            <Option value="latest">Latest First</Option>
                            <Option value="oldest">Oldest First</Option>
                        </Select>
                        <Button
                            type={showCancelled ? "primary" : "default"}
                            onClick={() => {
                                setShowCancelled(!showCancelled);
                                setStatusFilter('ALL');
                            }}
                            className="cancel-toggle-btn"
                            style={{
                                background: showCancelled ? 'linear-gradient(145deg, #4dabf7, #339af0)' : 'black',
                                color: 'white'
                            }}
                        >
                            {showCancelled ? "Show Active Bookings" : "Show Cancelled Bookings"}
                        </Button>
                    </div>
                </Space>
            </div>

            <div className="booking-table-container">
                <Table
                    dataSource={getFilteredAndSortedBookings()}
                    columns={columns}
                    pagination={{
                        pageSize: 4,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                        showQuickJumper: true,
                        showSizeChanger: false
                    }}
                    className="booking-table"
                    loading={bookings.length === 0}
                />
            </div>
        </div>
    );
};

export default BookingPage;
