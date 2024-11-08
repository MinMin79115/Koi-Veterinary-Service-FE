import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Input, Select, Space } from 'antd';
import { DeleteOutlined, FileDoneOutlined, PayCircleOutlined, ClockCircleOutlined, CheckCircleOutlined, StarOutlined, SearchOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingDetail.css';
import api from '../../config/axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const BookingDetail = () => {
  const token = useSelector(state => state.user.accessToken);
  const [bookings, setBookings] = useState([]);
  const user = useSelector((state) => state.user);
  const [noteModal, setNoteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bills, setBills] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showCancelled, setShowCancelled] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('ALL');


  //Open the note modal
  const openNoteModal = (record) => {
    setNoteModal(true);
    setSelectedRecord(record);
  }

  const closeNoteModal = () => {
    setNoteModal(false);
    setSelectedRecord(null);
  }

  const fetchFeedback = async () => {
    try {
      const response = await api.get(`feedbacks/booking/${selectedBooking.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const values = response.data.map(feedback => ({
        id: feedback.bookingId,
      }));
      setFeedback(values)
      console.log('feedback:', feedback);
    } catch (error) {
      console.log(error);
    }
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

  // Add this function to check if a booking is expired (over 10 minutes old)
  const isBookingExpired = (booking) => {
    if (booking.status !== 'PENDING' || booking.isPaid) return false;
    
    const bookingDate = new Date(booking.createdAt);
    const currentDate = new Date();
    const diffInMinutes = Math.floor((currentDate - bookingDate) / (1000 * 60));
    
    return diffInMinutes > 10;
  };

  const fetchBooking = async () => {
    try {
      const feedbackResponse = await api.get('feedback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const feedbacks = feedbackResponse.data;
      console.log('feedbackss:', feedbacks);
      if (user.role === 'CUSTOMER') {
        const response = await api.get(`bookings/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const values = response.data.map(booking => ({
          id: booking.bookingId,
          customerName: booking.user?.fullname,
          veterinarian: booking.veterinarian?.user?.fullname,
          email: booking.user?.email,
          service: booking.servicesDetail?.serviceId?.serviceName,
          serviceType: booking.servicesDetail?.serviceTypeId?.service_type,
          status: booking.status,
          price: booking.servicesDetail?.serviceTypeId?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
          note: booking.note,
          createdAt: booking.bookingTime,
          isPaid: bills.some(bill => bill.id === booking.bookingId),
          hasRating: feedbacks.some(feedback => feedback.bookingId.bookingId === booking.bookingId) ? "true" : "false"
        }));

        setBookings(values);
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
          note: booking.note,
          isPaid: bills.some(bill => bill.id === booking.bookingId),
          hasRating: feedbacks.some(feedback => feedback.bookingId.bookingId === booking.bookingId) ? "true" : "false"
        }));

        setBookings(values);
        console.log('bookings:', bookings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBill();
  }, []);

  useEffect(() => {
    fetchBooking();
  }, [bills]);



  const columns = [
    {
      title: 'Rated',
      dataIndex: 'hasRating',
      key: 'hasRating',
      width: '10%',
      align: 'center',
      className: 'column-border',
      hidden: user?.role === 'VETERINARIAN' || user?.role === 'CUSTOMER'
    },
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
      className: 'column-border',
      hidden: user?.role === 'VETERINARIAN' || user?.role === 'CUSTOMER'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
      align: 'center',
      hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN'
    },
    {
      title: 'Veterinarian',
      dataIndex: 'veterinarian',
      key: 'veterinarian',
      width: '20%',
      align: 'center',
      hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN'
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
      className: 'column-border',
      hidden: user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN'
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
          <span className={`badge ${
            status === 'PENDING' ? 'bg-warning' : 
            status === 'CONFIRMED' ? 'bg-success' : 
            status === 'COMPLETED' ? 'bg-info' : 
            'bg-danger'
          } d-flex justify-content-center py-2 fst-italic text-white`}>
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
      title: 'Total Price',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
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
        <><Button 
          onClick={() => showActionModal(record)}
          className="details-button"
          disabled={isBookingExpired(record)}
        >
          View Details
        </Button>
        {record.status === "COMPLETED" && record.hasRating === "false" && user?.role === 'CUSTOMER' && (
          <Button
            type="default"
            icon={<StarOutlined />}
            className="m-1 rate-button"
            onClick={() => {
              navigate('/#rating', { state: { booking: record } });
            }}
          >
            Rate Us
          </Button>
        )}
        </>
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
      console.log(response.data);
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

  //Lấy booking mới nhất xếp theo id giảm dần có nút ẩn/hiện booking cancel
  const filteredBookings = bookings
    .filter(booking => showCancelled ? booking.status === "CANCELLED" : booking.status !== "CANCELLED")
    .slice(showCancelled ? 15 : 0)
    .sort((a, b) =>  b.id - a.id)


  const showActionModal = (record) => {
    setSelectedBooking(record);
      setActionModal(true);
    };

  const closeActionModal = () => {
    setActionModal(false);
    setSelectedBooking(null);
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
    <div className="container-fluid py-4">
      <div className="booking-header">
        <h2 className="page-title text-center fw-bold mt-5">Booking History</h2>
        <div className="booking-controls">
          <Space size="middle" className="w-100 justify-content-between align-items-center mb-1">
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
                className="sort-select"
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
                className="cancel-toggle-btn ms-3"
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
      </div>

      <div className="booking-table-container">
        <Table
          dataSource={getFilteredAndSortedBookings()}
          columns={columns}
          pagination={{ 
            pageSize: 4,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
            showQuickJumper: true
          }}
          className="booking-table"
          loading={bookings.length === 0}
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
      <Modal
        open={actionModal}
        onCancel={closeActionModal}
        footer={null}
        centered
        width="90%"
        style={{ 
          maxWidth: '700px',
          minWidth: '300px'
        }}
        className="action-modal"
      >
        {selectedBooking && (
          <div className="booking-details">
            <div className="details-section">
              <h3>Booking Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Booking ID:</label>
                  <span>{selectedBooking.id}</span>
                </div>
                {(user?.role === 'CUSTOMER' || user?.role === 'VETERINARIAN') && (
                  <div className="info-item">
                    <label>Customer:</label>
                    <span>{selectedBooking.customerName}</span>
                  </div>
                )}
                {user?.role === 'CUSTOMER' && (
                  <div className="info-item">
                    <label>Veterinarian:</label>
                    <span>{selectedBooking?.veterinarian || 'No veterinarian available'}</span>
                  </div>
                )}
                {user?.role === 'VETERINARIAN' && (
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{selectedBooking.address}</span>
                  </div>
                )}
                
                <div className="info-item">
                  <label>Service:</label>
                  <span>{selectedBooking.service}</span>
                </div>
                <div className="info-item">
                  <label>Type:</label>
                  <span>{selectedBooking.serviceType}</span>
                </div>
                {selectedBooking.serviceType === "At_Home" && selectedBooking.status !== "CANCELLED" && (
                  <div className="info-item">
                    <label>Price:</label>
                    <span>{selectedBooking.price} <br /> <span className='text-success'>+10% each km (if above 10km)</span></span>
                  </div>
                )}
                {selectedBooking.serviceType !== "At_Home" && (
                  <div className="info-item">
                    <label>Price:</label>
                    <span>{selectedBooking.price}</span>
                  </div>
                )}
                <div className="info-item">
                  <label>Email:</label>
                  <span>{selectedBooking.email}</span>
                </div>
              </div>
            </div>
            <div className="status-progress">
              <div className="progress-container">
                <div className="progress-line">
                  <div 
                    className={`progress-fill ${
                      selectedBooking.status === 'CANCELLED' ? 'cancelled' :
                      selectedBooking.status === 'COMPLETED' ? 'completed' :
                      selectedBooking.status === 'CONFIRMED' ? 'confirmed' : 'pending'
                    }`}
                    style={{
                      width: selectedBooking.status === 'COMPLETED' ? '100%' :
                            selectedBooking.status === 'CONFIRMED' ? '66%' :
                            selectedBooking.status === 'PENDING' ? '33%' : '100%'
                    }}
                  />
                </div>
                {user?.role === 'CUSTOMER' && (
                  <>
                  <div className="progress-steps">
                    <div className={`progress-step ${selectedBooking.status === 'PENDING' || selectedBooking.status === 'CONFIRMED' || selectedBooking.status === 'COMPLETED' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>Pending</span>
                    </div>
                    <div className={`progress-step ${selectedBooking.status === 'CONFIRMED' || selectedBooking.status === 'COMPLETED' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>Confirmed</span>
                    </div>
                    <div className={`progress-step ${selectedBooking.status === 'COMPLETED' ? 'active' : ''}`}>
                      <div className="step-dot"></div>
                      <span>Completed</span>
                    </div>
                  </div>
                  </>
                )}
              </div>
            </div>
            <div className="actions-section">
              <h3>Available Actions</h3>
              <div className="action-buttons">
                {isBookingExpired(selectedBooking) ? (
                  <div className="text-danger text-center">
                    <p>This booking has expired. No actions available.</p>
                    <p>Please create a new booking.</p>
                  </div>
                ) : (
                  user?.role === 'CUSTOMER' ? (
                    <>
                      {selectedBooking.status === "COMPLETED" ? (
                        selectedBooking.note ? (
                          <Button 
                            onClick={() => {
                              closeActionModal();
                              openNoteModal(selectedBooking);
                            }}
                            type="primary"
                            className="m-1"
                          >
                            View Note
                          </Button>
                        ) : (
                          selectedBooking.serviceType !== "At_Center" ? (
                            <Button disabled className="m-1">No Note Available</Button>
                          ) : (
                            <p>Note is not available for this service type.</p>
                          )
                        )
                        
                      ) : selectedBooking.status === "PENDING" && (
                        <>
                          {!selectedBooking.isPaid ? (
                            <Button
                              type="primary"
                              icon={<PayCircleOutlined />}
                              onClick={() => handlePay(selectedBooking)}
                              className="m-1"
                            >
                              Pay for service
                            </Button>
                          ) : (
                            <div className='d-flex flex-column align-items-center'>
                              <p className='text-success'>Payment Completed <CheckCircleOutlined /></p>
                              <i>Waiting for confirmation</i>
                            </div>
                          )}
                          <Popconfirm
                            title="Delete Booking"
                            description="Are you sure you want to delete this booking?"
                            onConfirm={() => {
                              handleDeleteBooking(selectedBooking);
                              closeActionModal();
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button 
                              type="primary" 
                              danger 
                              icon={<DeleteOutlined />} 
                              className="m-1"
                              hidden={selectedBooking.isPaid}
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </>
                      )}
                    </>
                  ) : user?.role === 'VETERINARIAN' && (
                    <>
                      {selectedBooking.status === "CONFIRMED" && (
                        <Button
                          type="primary"
                          icon={<FileDoneOutlined />}
                          onClick={() => {
                            handleComplete(selectedBooking);
                            closeActionModal();
                          }}
                          className="m-1"
                        >
                          Complete
                        </Button>
                      )}
                      {selectedBooking.status === "COMPLETED" && selectedBooking.serviceType !== "At_Center" && (
                        <Button 
                          onClick={() => {
                            closeActionModal();
                            openNoteModal(selectedBooking);
                          }}
                          type="primary"
                          className="m-1"
                        >
                          Manage Note
                        </Button>
                      )}
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingDetail;
