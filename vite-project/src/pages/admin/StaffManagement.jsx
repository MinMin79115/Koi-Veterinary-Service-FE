import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import './StaffManagement.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Table, Modal, Form, Input, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';

const StaffManagement = () => {
  const api = 'https://66eec7d23ed5bb4d0bf1f314.mockapi.io/Students';

  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchStudent = async () => {
    //Lấy dữ liệu từ be
    const res = await axios.get(api);

    console.log(res.data)
    setStudents(res.data)
  }

  useEffect(() => {
    //Chạy 1 hành động
    //[] => chạy khi load trang lần đầu
    //[number] => chạy mỗi khi number thay đổi
    fetchStudent();
  }, []);

=======
import { Button, Table, Modal, Form, Input, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const roles = [{ role: 'STAFF' }, { role: 'VETERINARIAN' }];

  const fetchStaffs = async () => {
    try {
      const response = await api.get('customers', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setStaffs(response.data);
    } catch (error) {
      toast.error('Error fetching staffs:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleOpenModalEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue({
      fullname: record.fullname,
      phone: record.phone,
      address: record.address,
      role: record.role,
    });
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setEditingStaff(null);
    form.resetFields();
  };

  const handleSubmitEdit = async (values) => {
    try {
      const response = await api.post(`veterinarian/${editingStaff.id}`, {
        serviceTypeId: values.serviceTypeId
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      toast.success("Successfully updated!");
      fetchStaffs();
    } catch (err) {
      toast.error(err.response?.data || "An error occurred while updating the staff.");
    }
  }

  const handleSubmitStaffs = async (values) => {
    const valuesToSend = {
      username: values.phone,
      fullname: values.fullname,
      phone: values.phone,
      address: values.address,
      password: "123456",
      role: values.role
    };

    try {
      setSubmitting(true);
      const response = await api.post('auth/addstaff', valuesToSend, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      toast.success("Successfully created!");
      setOpenModal(false);
      form.resetFields();
      fetchStaffs();
    } catch (err) {
      toast.error(err.response?.data || "An error occurred while creating the staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await api.delete(`customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res);
      toast.success("Delete successfully!");
      fetchStaffs();
    } catch (err) {
      console.error('Error deleting staff:', err);
      toast.error(err.response?.data || "An error occurred while deleting the staff.");
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredData = staffs.filter(item =>
    item.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
<<<<<<< HEAD
      titleName: "Name",
      dataIndex: "name",
      key: "name",
    }, 
    {
      titleName: "Phone",
      dataIndex: "phone",
      key: "phone",
    }, 
    {
      titleName: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  const handleSubmitStudent = async (values) => {
    //Xử lý thông tin student trong Form
    //Post xuống API
    console.log(values)
    try {
      setSubmitting(true);//loading
      const res = await axios.post(api, values)
      //Toast css for beautiful
      toast.success("Successfully !")
      setOpenModal(false)
      form.resetFields()
      fetchStudent();
    } catch (err) {
      toast.error(err)
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div>
      <Button onClick={handleOpenModal}>Create new student</Button>
      <Table columns={columns} dataSource={students} />
      {/* onCancel: Bấm ra ngoài thì hành động được chạy */}
      {/* onOK: Chạy hàm trong Modal */}
      <Modal onOk={() => form.submit()} title="Create new Student" open={openModal} onCancel={handleCloseModal}>
        {/* name: tên biến trùng (phù hợp) với DB */}
        {/* rule: Định nghĩa validation => [] */}
        <Form onFinish={handleSubmitStudent} form={form}>
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
=======
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      align: 'center',
      render: (_, record) => (
        <div className='d-flex gap-2 justify-content-center'>
          {record.role === 'VETERINARIAN' ? (
            <>
              <Button type='primary' onClick={() => handleOpenModalEdit(record)}>Edit</Button>
              <Popconfirm
                title="Delete"
                description="Are you sure you want to delete this staff?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type='primary' danger>Delete</Button>
              </Popconfirm>
            </>
          ) : (
            <Popconfirm
              title="Delete"
              description="Are you sure you want to delete this staff?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type='primary' danger>Delete</Button>
            </Popconfirm>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <Button onClick={handleOpenModal}>Create new staff</Button>
      <Input
        placeholder="Search name"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ margin: 16, width: '60%' }}
      />
      <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 7 }} />
      <Modal onOk={() => form.submit()} title="Create new Staff" open={openModal} onCancel={handleCloseModal}>
        <Form onFinish={handleSubmitStaffs} form={form}>
          <Form.Item label="Staff name" name="fullname" rules={[{ required: true, message: "Please input name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Staff phone" name="phone" rules={[
            { required: true, message: "Please input your staff phone!" },
            { pattern: '^(0[1-9]{1}[0-9]{8}|(84[1-9]{1}[0-9]{8}))$', message: "Invalid format!" }
          ]}>
            <Input placeholder='+84' />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please input staff's address!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role!" }]}>
            <Select>
              {roles.map((role, index) => (
                <Select.Option key={index} value={role.role}>
                  {role.role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal onOk={() => form.submit()} title="Edit Staff" open={openModalEdit} onCancel={handleCloseModalEdit}>
        <Form onFinish={handleSubmitEdit} form={form}>
          <Form.Item label="Service Type ID: 1 - Online" name="serviceTypeId" rules={[{ required: true, message: "Please select a service type!" }]}>
            <Input />
          </Form.Item>
          
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
        </Form>
      </Modal>
    </div>
  );
};

<<<<<<< HEAD
export default StaffManagement;
=======
export default StaffManagement;
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
