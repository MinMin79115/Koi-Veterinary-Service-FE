import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Input, Modal, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FAQ.css';

const FAQManagement = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();

  const api = 'https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ';

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(api);
      setFaqData(response.data);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqData();
  }, []);

  const handleEdit = (record) => {
    setEditingFaq(record);
    form.setFieldsValue({
      Answer: record.Answer || ''
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`${api}/${editingFaq.id}`, {
        ...editingFaq,
        Answer: values.Answer
      });
      toast.success('Answer updated successfully');
      setEditModalVisible(false);
      fetchFaqData();
    } catch (error) {
      console.error('Error updating answer:', error);
      toast.error('Failed to update answer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/${id}`);
      toast.success('FAQ deleted successfully');
      fetchFaqData();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete FAQ');
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
      title: 'Question',
      dataIndex: 'Question',
      key: 'Question',
      width: '35%',
      align: 'center',
      filteredValue: [searchTerm],
      onFilter: (value, record) => {
        return String(record.Question)
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    {
      title: 'Answer',
      dataIndex: 'Answer',
      key: 'Answer',
      width: '35%',
      align: 'center',
      render: (text) => text || 'No answer yet'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <div className="d-flex justify-content-center gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete FAQ"
            description="Are you sure you want to delete this FAQ?"
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
        </div>
      )
    }
  ];

  return (
    <div className="faq-management-container mt-2">
      <h1 className="faq-title">FAQ Management</h1>
      <div className="search-container mb-4">
        <Input.Search
          placeholder="Search questions..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <Table
        columns={columns}
        dataSource={faqData}
        loading={loading}
        pagination={{
          pageSize: 6,
          position: ['bottomCenter'],
          showSizeChanger: false
        }}
        className="faq-table"
        scroll={{ x: true }}
      />

      <Modal
        title="Edit Answer"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Save"
        className="edit-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="Answer"
            label="Answer"
            rules={[{ required: true, message: 'Please input an answer!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FAQManagement;
