import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Input } from 'antd';
import { DeleteOutlined, FileDoneOutlined, PayCircleOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingDetail.css';
import api from '../../config/axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BookingDetail = () => {
  const token = useSelector(state => state.user.accessToken);
  const [bookings, setBookings] = useState([]);
  const [payStatus, setPayStatus] = useState('')
  const user = useSelector((state) => state.user);
  const [noteModal, setNoteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bills, setBills] = useState([]);
  const [showCancelled, setShowCancelled] = useState(false);


  //Open the note modal
  const openNoteModal = (record) => {
    setNoteModal(true);
    setSelectedRecord(record);
  }

  const closeNoteModal = () => {
    setNoteModal(false);
    setSelectedRecord(null);
  }

  const fetchBill = async () => {
    try {
      const response = await api.get(`payment`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const values = response.data.map(bill => ({
        id: bill.booking.bookingId,
      }));
      setBills(values);
      console.log('bills:', bills);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchBooking = async () => {
    try {
      if (user.role === 'CUSTOMER') {
        const response = await api.get(`bookings/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);

        const values = response.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.user?.fullname,
          email: booking.user?.email,
          service: booking.servicesDetail?.serviceId?.serviceName,
          serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
          status: booking.status,
          price: booking.servicesDetail?.serviceTypeId?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
          note: booking.note
        }));

        setBookings(values); //Set bookings to an array of booking objects      
      } else {
        const response = await api.get(`bookings/veterinarian/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);

        const values = response.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.user?.fullname,
          email: booking.user?.email,
          address: booking.user?.address,
          service: booking.servicesDetail?.serviceId?.serviceName,
          serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
          status: booking.status,
          price: booking.servicesDetail?.serviceTypeId?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
          note: booking.note
        }));

        setBookings(values); //Set bookings to an array of booking objects
      }
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
      hidden: user?.role === 'VETERINARIAN' || user?.role === 'CUSTOMER'
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
      align: 'center',
      hidden: user?.role === 'CUSTOMER'
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
      className: 'column-border',
      render: (_, record) => (
        record.serviceType === 'At_Home' && record.status !== 'CANCELLED' ? <span>{record.price} <br /> <span className='text-success'>+10% each km (if above 10km)</span></span> : <span>{record.price}</span>
      )
    },
    {
      title: 'Action',
      align: 'center',
      className: 'column-border',
      render: (_, record) => (
        <div className="d-flex flex-column flex-md-row justify-content-center">
          {user?.role === 'CUSTOMER'? (
            record.status === "COMPLETED" ? (
              // Đang fix ở đây
              record.note ? 
              <Button 
                onClick={() => openNoteModal(record)} 
                type='primary'
                className="btn-custom d-flex justify-content-center m-1 text-white"
              >
                You Have A Note
              </Button> :
              record.serviceType !== "At_Center" ?
              <Button 
                type='default' 
                className="btn-custom d-flex justify-content-center m-1"
                disabled
              >
                No Note Available
              </Button> :
              <i className='text-info'>COMPLETED</i>
            ) : record.status === "CANCELLED" ? (
              <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
            )  : record.status === "CONFIRMED" ? (
              <p className='fst-italic fs-6 text-success'>CONFIRMED</p>
            ): bills.find(bill => bill.id === record.id)? (
              <>
                {setPayStatus('PAID')}
                <p className='fst-italic fs-6 text-success'>{payStatus}</p>
              </>
            ) : (
              <>
                <p className='fst-italic fs-6 text-warning'>{bills.id}</p>
                <div className='d-flex justify-content-around'>
                  <Button
                    type='none'
                    className="btn-custom btn btn-success d-flex justify-content-center m-1"
                    icon={<PayCircleOutlined />}
                    onClick={() => handlePay(record)}
                  >
                    Pay
                  </Button>
                  <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete this booking?"
                    className="btn-custom btn btn-danger d-flex justify-content-center m-1"
                    onConfirm={() => handleDeleteBooking(record)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button  type='primary' icon={<DeleteOutlined />} danger>Delete</Button>
                  </Popconfirm>
                </div>
              </>
            )
          ) : user?.role === 'VETERINARIAN'  ? (
            record.status === "CONFIRMED" ? (
              <Button
                type='none'
                icon={<FileDoneOutlined />}
                className="btn-custom btn btn-success d-flex justify-content-center m-1"
                onClick={() => handleComplete(record)}
              >
                Complete
              </Button>
            ) : record.status === "COMPLETED" ? (
              record.serviceType !== "At_Center" ? 
              <Button 
                onClick={() => openNoteModal(record)} 
                type='primary' 
                className="btn-custom d-flex justify-content-center m-1 text-white"
              >
                Note
              </Button> :
              <i className='text-info'>COMPLETED</i>
            ) : record.status === "CANCELLED" ? (
              <p className='fst-italic fs-6 text-danger'>CANCELLED</p>
            ) : (
              <p className='text-primary'>Waiting for confirming</p>
            )
          ) : (
            <>
              <p className='fst-italic fs-6 text-warning'>{payStatus}</p>
            </>
          )}
        </div>
      )
    }
  ];

  const handleNote = async () => {
    const valuesToUpdate = {
      note: selectedRecord.note
    }
    try {
      const response = await api.put(`bookings/${selectedRecord.id}`, valuesToUpdate, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      toast.success('Note saved.')
      console.log(response.data);
      fetchBooking()
      closeNoteModal()
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const handleDeleteBooking = async (record) => {
    try {
      const response = await api.put(`bookings/delete/${record.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      toast.success('Deleted successful.')
      fetchBooking()
    } catch (error) {
      console.log(error.response.data)
    }
  };

  const handlePay = async (record) => {
    try {
      // Parse the price string to a number
      const priceValue = parseFloat(record.price.replace(/[^\d,]/g, '').replace(',', '.'));
      
      if (isNaN(priceValue)) {
        throw new Error('Invalid price format');
      }

      // Convert to smallest currency unit (e.g., cents)
      const amount = Math.round(priceValue);
      const resPayment = await api.get(`payment/vnpay?amount=${amount}&bankCode=NCB&bookingId=${record.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(resPayment.data);
      
      // Open the payment URL in a new window
      if (resPayment.data && resPayment.data.data && resPayment.data.data.paymentUrl) {
        window.open(resPayment.data.data.paymentUrl, '_blank');
      } else {
        console.log('Payment URL not found');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data || 'An error occurred during payment processing');
    }
  };

  const handleComplete = async (record) => {
    
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

    try {
      const valuesToUpdate = {
        status: 'COMPLETED'
      }
      const response = await api.put(`bookings/${record.id}`, valuesToUpdate, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      //Update the booking status to COMPLETED
      toast.success('Complete successful.')
      fetchBooking()
    } catch (error) {
      console.log(error.response.data)
    }finally{
        const resMail = await api.post(`mail/send/${record.email}`, format, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(resMail.data)
    }
  };

  //Lấy 10 booking mới nhất xếp theo id giảm dần
  const filteredBookings = bookings
    .filter(booking => showCancelled ? booking.status === "CANCELLED" : booking.status !== "CANCELLED")
    .sort((a, b) => b.id - a.id)
    .slice(showCancelled ? 10 : 0);

  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4 text-center fw-bold">Booking Detail</h2>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-3">
                <Button 
                  type={showCancelled ? "primary" : "default"}
                  onClick={() => setShowCancelled(!showCancelled)}
                  className="mb-3"
                >
                  {showCancelled ? "Show Active Bookings" : "Show Cancelled Bookings"}
                </Button>
              </div>
              <div className="table-responsive">
                <Table
                  dataSource={filteredBookings}
                  columns={columns}
                  pagination={{ pageSize: 6 }}
                  className="table"
                />
              </div>
              <Modal
                title="Note"
                open={noteModal}
                onCancel={closeNoteModal}
                onOk={() => handleNote(selectedRecord)}
                okButtonProps={{ style: { display: user.role === 'CUSTOMER' ? 'none' : 'inline-block' } }} // Hide OK button for CUSTOMER
              >
                {user.role === 'VETERINARIAN' ? (
                  <Input.TextArea size='large' rows={6} value={selectedRecord?.note} onChange={(e) => setSelectedRecord({ ...selectedRecord, note: e.target.value })} />
                ) : (
                  <>
                    <span className='fw-bold'>Your prescription:</span>
                    <p>{selectedRecord?.note || 'No note available'}</p>
                  </>
                )}
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
