import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Table, Modal, Form, Input, Popconfirm } from 'antd';
import { useForm } from 'antd/es/form/Form';
import api from '../../config/axios';

const StaffManagement = () => {
  const api = 'https://66eec7d23ed5bb4d0bf1f314.mockapi.io/Students';

  const [staffs, setStaffs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  
  const fetchStaffs = async () => {
    //Lấy dữ liệu từ be
    try {
      // const response = await api.get('customers', {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // });
      const res = await axios.get(api)
      console.log(res.data)
      setStaffs(res.data);
    } catch (error) {
      toast.error('Error fetching staffs:', error.response.data);
    }
  }

  useEffect(() => {
    //Chạy 1 hành động
    //[] => chạy khi load trang lần đầu
    //[number] => chạy mỗi khi number thay đổi
    fetchStaffs();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const handleSubmitStaffs = async (values) => {
    //Xử lý thông tin trong Form
    //Post xuống API
    const valuesStaff = {
      username: values.phone,
      name: values.name,
      phone: values.phone,
      address: values.address,
      password: "123456"
    }
    console.log(valuesStaff)
    try {
      setSubmitting(true);//loading
      // const res = await api.post('api/customers', valuesStaff, {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // })
      const res = await axios.post(api, valuesStaff)
      //Toast css for beautiful
      toast.success("Successfully !")
      setOpenModal(false)
      form.resetFields()
      fetchStaffs();
    } catch (err) {
      toast.error(err)
    } finally {
      setSubmitting(false);
    }
  }

  
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = staffs.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      render: (_, record) => (
        <div>
          <Popconfirm
            title="Delete"
            description="Are you sure you want to delete this staff?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type='primary' danger>Delete</Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  //Delete staff
  const handleDelete = async (id) => {
    try {
      // await api.delete(`api/customers/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem('token')}`
      //   }
      // });
      await axios.delete(`${api}/${id}`)
      toast.success("Delete successfully!");
      fetchStaffs();
    } catch (err) {
      console.error('Error deleting staff:', err);
      toast.error(err.response?.data || "An error occurred while deleting the staff.");
    }
  }

  return (
    <div>
      <Button onClick={handleOpenModal}>Create new staff</Button>
      <Input
        placeholder="Search name"
        prefix={<searchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ margin: 16, width: '60%'}}
      />
      <Table dataSource={filteredData} columns={columns} />
      {/* onCancel: Bấm ra ngoài thì hành động được chạy */}
      {/* onOK: Chạy hàm trong Modal */}
      <Modal onOk={() => form.submit()} title="Create new Staff" open={openModal} onCancel={handleCloseModal}>
        {/* name: tên biến trùng (phù hợp) với DB */}
        {/* rule: Định nghĩa validation => [] */}
        <Form onFinish={handleSubmitStaffs} form={form}>
          <Form.Item label="Staff name" name="name" rules={[
            {
              required: true,
              message: "Please input name !"
            }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item label="Staff phone" name="phone" rules={[
            {
              required: true,
              message: "Please input your staff phone!"
            },
            {
              pattern: '^(0[1-9]{1}[0-9]{8}|(84[1-9]{1}[0-9]{8}))$',
              message: "Invalid format!"
            }
          ]}>
            <Input placeholder='+84' />
          </Form.Item>
          <Form.Item label="Adress" name="address" rules={[
            {
              required: true,
              message: "Please input staff's address !"
            }
          ]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;