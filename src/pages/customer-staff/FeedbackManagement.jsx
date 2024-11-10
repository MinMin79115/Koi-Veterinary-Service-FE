import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Input } from 'antd';
import { DeleteOutlined, StarFilled, SearchOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './FeedbackManagement.css';

const { Search } = Input;

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.accessToken);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('feedback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const formattedFeedbacks = response.data.map(feedback => ({
        id: feedback.feedbackId,
        bookingId: feedback.bookingId?.bookingId,
        customerName: feedback.bookingId?.user?.fullname,
        serviceName: feedback.bookingId?.servicesDetail?.serviceId?.serviceName,
        serviceType: feedback.bookingId?.servicesDetail?.serviceTypeId?.service_type,
        rating: feedback.rating,
        comment: `"${feedback.feedback}"`,
      }));

      setFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`feedback/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Feedback deleted successfully');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        align: 'center'
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      width: '10%',
      align: 'center'
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '15%',
      align: 'center'
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <div>
          <div>{record.serviceName}</div>
          <small className="text-muted">{record.serviceType}</small>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: '15%',
      align: 'center',
      render: (rating) => (
        <div className="rating-display">
          {[...Array(rating)].map((_, index) => (
            <StarFilled key={index} className="star-icon" />
          ))}
        </div>
      )
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: '25%',
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Delete Feedback"
          description="Are you sure you want to delete this feedback?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div className="feedback-management-container mt-2">
        <h1 className="feedback-title">Feedback Management</h1>
      <Table
        columns={columns}
        dataSource={feedbacks}
        loading={loading}
        pagination={{
          pageSize: 6,
          position: ['bottomCenter'],
          showSizeChanger: false
        }}
        className="feedback-table"
        scroll={{ x: true }}
      />
    </div>
  );
};

export default FeedbackManagement; 