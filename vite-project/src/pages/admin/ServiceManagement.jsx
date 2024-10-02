import React, { useState, useEffect } from 'react';
import './StaffManagement.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Table, Modal, Form, Input, Popconfirm } from 'antd';
import { useForm } from 'antd/es/form/Form';
import api from '../../config/axios';
const ServiceManagement = () => {
    // const api = 'https://66eec7d23ed5bb4d0bf1f314.mockapi.io/Services';

    const [services, setServices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [form] = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchServices = async () => {
        //Lấy dữ liệu từ be
        try {
            const response = await axios.get(api);
            setServices(response.data);
        } catch (error) {
            toast.error('Error fetching services:', error.response.data);
        }
    }

    useEffect(() => {
        //Chạy 1 hành động
        //[] => chạy khi load trang lần đầu
        //[number] => chạy mỗi khi number thay đổi
        fetchServices();
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleSubmitServices = async (values) => {
        //Xử lý thông tin trong Form
        //Post xuống API
        console.log(values)
        try {
            setSubmitting(true);//loading
            const res = await axios.post(api, values)
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



    const handleUpdate = async (values) => {
        try {
            const response = await axios.put(`${api}/${values.id}`, values)
            console.log(response.data)
            toast.success("Update successfully!")
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Error updating service:', error.response.data);
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = services.filter(item =>
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
            title: "Action",
            render: (_, record) => (
                <div>
                    <Button type='primary' onClick={() => handleUpdate(record.id)}>Update</Button>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this service?"
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

    //Delete service
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${api}/${id}`);
            toast.success("Delete successfully!");
            fetchStaffs();
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error(err.response?.data || "An error occurred while deleting the service.");
        }
    }

    return (
        <div>
            <Button onClick={handleOpenModal}>Create new service</Button>
            <Input
                placeholder="Search name"
                prefix={<searchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ margin: 16 }}
            />
            <Table dataSource={filteredData} columns={columns} />
            {/* onCancel: Bấm ra ngoài thì hành động được chạy */}
            {/* onOK: Chạy hàm trong Modal */}
            <Modal onOk={() => form.submit()} title="Services" open={openModal} onCancel={handleCloseModal}>
                {/* name: tên biến trùng (phù hợp) với DB */}
                {/* rule: Định nghĩa validation => [] */}
                <Form onFinish={handleSubmitServices} form={form}>
                    <Form.Item label="Service name" name="name" rules={[
                        {
                            required: true,
                            message: "Please input name !"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal>
                <Form onFinish={handleUpdate} form={form}>
                    <Form.Item
                        name="name"
                        label="Service"
                        rules={[{ required: true, message: 'Please input service!' }]}
                    >
                    <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default ServiceManagement;