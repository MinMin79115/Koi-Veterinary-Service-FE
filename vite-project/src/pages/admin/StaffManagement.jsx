import React, { useState, useEffect } from 'react';
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
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
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;