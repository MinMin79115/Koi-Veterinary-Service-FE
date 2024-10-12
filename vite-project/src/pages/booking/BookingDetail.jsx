import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingDetail.css';
import api from '../../config/axios'

const BookingDetail = () => {
  const [booking, setBooking] = useState([
    { id: '1', customerName: 'HungDung', dateTime: '2024-10-14 7:00:00', service: 'Interview', serviceType: 'Online', status: 'Pending', price: '200.000 VNĐ' },
    { id: '3', customerName: 'MinMin', dateTime: '2024-10-14 15:00:00', service: 'Health Checking', serviceType: 'At center', status: 'Pending', price: '300.000 VNĐ' },
    { id: '2', customerName: 'Customer', dateTime: '2024-10-14 9:00:00', service: 'Pond Checking', serviceType: 'At home', status: 'Confirmed', price: '450.000 VNĐ' },

  ]);

  // const fetchBooking = async () => {      
  //   try{
  //     const response = await api.get('bookings')
  //     setBooking(response.data)
  //   }catch(error){
  //     toast.error("Fetching booking failed.")
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   fetchBooking()
  // },[])

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
        <span className={`badge ${status === 'Pending' ? 'bg-warning' : 'bg-success'} d-flex justify-content-center py-2 fst-italic`}>
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
          <Button
            type='none'
            className="btn-custom btn btn-danger d-flex justify-content-center mx-1 my-1"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBooking(record)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handleDeleteBooking = async (record) => {
    try {
      const response = await api.delete(`bookings${record.id}`)
      toast.success('Deleted successful.')
      fetchBooking()
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4 text-center">Booking Detail</h2>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  dataSource={booking}
                  columns={columns}
                  pagination={{ pageSize: 6 }}
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

export default BookingDetail;