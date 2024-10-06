import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingManagement.css';

const BookingPage = () => {
    const [bookingRequests, setBookingRequests] = useState([
        { id: '1', customerName: 'HungDung', service: 'Interview', status: 'Pending' },
        { id: '2', customerName: 'hd', service: 'Health Checking', status: 'Pending' },
        { id: '3', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '4', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '5', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '6', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '7', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '8', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '9', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        { id: '10', customerName: 'mt', service: 'Pond Checking', status: 'Pending' },
        
    ]);

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
                <span className={`badge ${status === 'Pending' ? 'bg-warning' : status === 'Accepted' ? 'bg-success' : 'bg-danger'} d-flex justify-content-center`}>
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
                    <Button 
                        type="primary" 
                        className="btn btn-success d-flex justify-content-center" 
                        icon={<CheckCircleOutlined />} 
                        onClick={() => handleConfirmBooking(record.id)}
                    >
                        Confirm
                    </Button>
                    <Button 
                        type="primary" 
                        className="btn btn-warning d-flex justify-content-center mb-2 mb-md-0 mx-md-2"
                        icon={<CloseCircleOutlined />} 
                        onClick={() => handleRejectBooking(record.id)}
                    >
                        Reject
                    </Button>
                    <Button 
                        type="primary" 
                        className="btn btn-danger d-flex justify-content-center"
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteBooking(record.id)}
                    >
                        Delete
                    </Button>
                </div>
            )
        }
    ];

    const handleConfirmBooking = (id) => {
        setBookingRequests(bookingRequests.map(request =>
            request.id === id ? { ...request, status: 'Accepted' } : request
        ));
    };

    const handleRejectBooking = (id) => {
        setBookingRequests(bookingRequests.map(request => 
            request.id === id ? { ...request, status: 'Rejected'} : request
        ));
    };

    const handleDeleteBooking = (id) => {
        setBookingRequests(bookingRequests.filter(request => request.id !== id));
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
                                    dataSource={bookingRequests} 
                                    columns={columns} 
                                    pagination={{ pageSize: 5 }}
                                    className="table"
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