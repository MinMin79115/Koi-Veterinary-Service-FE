import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { Button, Table, Modal, Form, Input, Popconfirm } from 'antd';
import { useForm } from 'antd/es/form/Form';
import api from '../../config/axios';
import { useDispatch, useSelector } from 'react-redux';

const ServiceManagement = () => {
    // const api = 'https://66ff9fda4da5bd23755149e9.mockapi.io/Service';

    const [services, setServices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [form] = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingService, setEditingService] = useState(null);
    const dispatch = useDispatch();

    const fetchServices = async () => {
        //Lấy dữ liệu từ be
        try {
              const response = await api.get('services', {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
              });
            // const response = await axios.get(api);
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

    //setting information of object has been choosen to be edited
    const handleOpenModalEdit = (record) => {
        setEditingService(record);
        form.setFieldsValue({ name: record.name || '' });
        setOpenModalEdit(true);
    };


    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenModalEdit(false);
    }

    const handleSubmitService = async (values) => {
        //Xử lý thông tin trong Form
        //Post xuống API
        try {
            setSubmitting(true);//loading
              const response = await api.post('services', values, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
              })
           // const res = await axios.post(api, values);
            //Toast css for beautiful
            toast.success("Successfully !")
            setOpenModal(false)
            form.resetFields()
            fetchServices();
        } catch (err) {
            toast.error(err)
        } finally {
            setSubmitting(false);
        }
    }

    //update service
    const updateService = async (values) => {
        try {
              await api.put(`services/${editingService.serviceId}`, {
                serviceName: values.serviceName,
                serviceDescription: values.serviceDescription
              }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                  }
              });
            // // const res = await axios.put(`${api}/${editingService.id}`, {
            //     name: values.name,
            //     description: values.description
            // });
            toast.success('Service updated successfully');
            fetchServices();
            setOpenModalEdit(false);
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update service');
        }
    };

    //Delete service
    const handleDelete = async (id) => {
        try {
              await api.delete(`services/${id}`, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
              });
            // const res = await axios.delete(`${api}/${id}`);
            toast.success("Delete successfully!");
            fetchServices();
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error(err.response?.data || "An error occurred while deleting the service.");
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = services.filter(item =>
        item.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const columns = [
        {
            title: "ID",
            dataIndex: "serviceId",
            key: "serviceId",
            width: "5%",
        },
        {
            title: "Service Name",
            dataIndex: "serviceName",
            key: "serviceName",
            width: "20%",
        },
        {
            title: "Description",
            dataIndex: "serviceDescription",
            key: "serviceDescription",
            width: "40%",
        },
        {
            title: "Action",
            className: "text-center",
            render: (_, record) => (
                <div>
                    <>
                        <div className='d-flex justify-content-center'>
                        <Button className='mx-1' type="primary" onClick={() => handleOpenModalEdit(record)} style={{ marginRight: 8 }}>
                            Edit Service
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this question?"
                            onConfirm={() => handleDelete(record.serviceId)}
                            okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger>Delete</Button>
                            </Popconfirm>
                        </div>
                    </>
                </div>
            )
        },
    ];


    return (
        <div>
            <Button onClick={handleOpenModal}>Create new service</Button>
            <Input
                placeholder="Search name"
                prefix={<searchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ margin: 16, width: '60%' }}
            />
            <Table 
            dataSource={filteredData} 
            columns={columns}                                     
            pagination={{ pageSize: 5 }}         
            />
            {/* onCancel: Bấm ra ngoài thì hành động được chạy */}
            {/* onOK: Chạy hàm trong Modal */}
            <Modal onOk={() => form.submit()} title="Create new service" open={openModal} onCancel={handleCloseModal}>
                {/* name: tên biến trùng (phù hợp) với DB */}
                {/* rule: Định nghĩa validation => [] */}
                <Form onFinish={handleSubmitService} form={form}>
                    <Form.Item label="Service name" name="serviceName" rules={[
                        {
                            required: true,
                            message: "Please input name !"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="serviceDescription" rules={[
                        {
                            required: true,
                            message: "Please input description !"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal onOk={() => form.submit()} title="Edit service" open={openModalEdit} onCancel={handleCloseModal}>
                {/* name: tên biến trùng (phù hợp) với DB */}
                {/* rule: Định nghĩa validation => [] */}
                <Form onFinish={updateService} form={form}>
                        <Form.Item label="Service name" name="serviceName" rules={[
                            {
                                required: true,
                                message: "Please input name !"
                            }
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Description...." name="serviceDescription" rules={[
                            {
                                required: true,
                                message: "Please input description !"
                            }
                        ]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceManagement;