import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingManagement.css';
import api from '../../config/axios'

const BookingPage = () => {
    const [bookingRequests, setBookingRequests] = useState([
        { id: '1', customerName: 'HungDung', service: 'Interview', status: 'PENDING' },
        { id: '2', customerName: 'hd', service: 'Health Checking', status: 'PENDING' },
        { id: '3', customerName: 'mt', service: 'Pond Checking', status: 'CONFIRMED' },
        { id: '10', customerName: 'mt', service: 'Pond Checking', status: 'COMPLETED' },
        
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
                <span className={`badge ${status === 'PENDING' ? 'bg-warning' : status === 'CONFIRMED' ? 'bg-success' : 'bg-info'} d-flex justify-content-center py-2 fst-italic`}>
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
                    ) : (
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
                    )}
                </div>
            )
        }
    ];

   
    const handleConfirmBooking = async (record) => {
        const valuesToUpdate = {
            status: 'CONFIRMED'
        }
        try{
            const response = await api.put(`bookings${record.id}`, valuesToUpdate)
            toast.success('Confirmed.')
        }catch(error){
            console.log(error)
        }
    };

    const handleDeleteBooking = async (record) => {
        try{
            const response = await api.delete(`bookings${record.id}`)
            toast.success('Deleted successful.')
        }catch(error){
            console.log(error)
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
                                    dataSource={bookingRequests} 
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
