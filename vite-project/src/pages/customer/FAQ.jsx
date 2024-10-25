import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Form, Modal, message, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const FAQManagement = () => {
  const [faqData, setFaqData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form] = Form.useForm();
  const api = 'https://66fa96f0afc569e13a9c5417.mockapi.io/FAQ';

  useEffect(() => {
    fetchFaqData();
  }, []);

  const fetchFaqData = async () => {
    try {
      const response = await axios.get(api);
      setFaqData(response.data);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      updateFaq(values);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingFaq(null);
    form.resetFields();
  };


  const handleEdit = (record) => {
    setEditingFaq(record);
    form.setFieldsValue({ Answer: record.Answer || '' });
    setIsModalVisible(true);
  };
  
  const updateFaq = async (values) => {
    try {
      await axios.put(`${api}/${editingFaq.id}`, {
        Question: editingFaq.Question,
        Answer: values.Answer
      });
      toast.success('Answer updated successfully');
      setIsModalVisible(false);
      fetchFaqData();
    } catch (error) {
      console.error('Error updating answer:', error);
      toast.error('Failed to update answer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/${id}`);
      toast.success('Deleted successfully');
      fetchFaqData();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  //filter thành lower để khớp với dữ liệu search (Search = Question)
  const filteredFaqData = faqData.filter(item =>
    item.Question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Question',
      dataIndex: 'Question',
      key: 'Question',
    },
    {
      title: 'Answer',
      dataIndex: 'Answer',
      key: 'Answer',
      render: (text) => text || 'No answer yet',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit Answer
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this question?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search questions"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16}}
      />
      <Table dataSource={filteredFaqData} columns={columns} />

      <Modal
        title="Edit Answer"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Question">
            <Input value={editingFaq?.Question} disabled />
          </Form.Item>
          <Form.Item
            name="Answer"
            label="Answer"
            rules={[{ required: true, message: 'Please input the answer!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FAQManagement;
