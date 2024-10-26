import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const ServiceManagement = () => {
    const token = useSelector(state => state.user.accessToken);
    const [services, setServices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [form] = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingService, setEditingService] = useState(null);

    const fetchServices = async () => {
        try {
            const response = await api.get('services', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error.response?.data);
            toast.error('Failed to fetch services');
        }
    }

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = () => {
        form.resetFields();
        setOpenModal(true);
    }

    const handleOpenModalEdit = (record) => {
        setEditingService(record);
        form.setFieldsValue(record);
        setOpenModalEdit(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenModalEdit(false);
        form.resetFields();
    }

    const handleSubmitService = async (values) => {
        try {
            setSubmitting(true);
            await api.post('services', values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Service added successfully!");
            setOpenModal(false);
            form.resetFields();
            fetchServices();
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    }

    const updateService = async (values) => {
        try {
            setSubmitting(true);
            await api.put(`services/${editingService.serviceId}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Service updated successfully');
            setOpenModalEdit(false);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Service deleted successfully!");
            fetchServices();
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error(err.response?.data?.message || "An error occurred while deleting the service");
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = services.filter(item =>
        item.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredData.sort((a, b) => b.serviceId - a.serviceId);

    const columns = [
        {
            title: "ID",
            dataIndex: "serviceId",
            key: "serviceId",
            width: "10%",
        },
        {
            title: "Service Name",
            dataIndex: "serviceName",
            key: "serviceName",
            width: "30%",
        },
        {
            title: "Description",
            dataIndex: "serviceDescription",
            key: "serviceDescription",
            width: "40%",
        },
        {
            title: "Action",
            key: "action",
            width: "20%",
            align: 'center',
            render: (_, record) => (
                <div className='d-flex justify-content-center'>
                    <Button className='mx-1' type="primary" onClick={() => handleOpenModalEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this service?"
                        onConfirm={() => handleDelete(record.serviceId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </div>
            )
        },
    ];

    return (
        <>
            <div className="row mb-3">
                <div className="col-12 col-md-6 col-lg-4 mb-2">
                    <Button onClick={handleOpenModal} className="w-100">Create new service</Button>
                </div>
                <div className="col-12 col-md-6 col-lg-8 mb-2">
                    <Input
                        placeholder="Search service name"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-100"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        pagination={{ pageSize: 7 }}
                        rowKey="serviceId"
                        className="w-100"
                    />
                </div>
            </div>
            <Modal
                onOk={() => form.submit()}
                title="Create new Service"
                open={openModal}
                onCancel={handleCloseModal}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form onFinish={handleSubmitService} form={form} layout="vertical">
                    <Form.Item
                        name="serviceName"
                        label="Service Name"
                        rules={[{ required: true, message: "Please input the service name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serviceDescription"
                        label="Description"
                        rules={[{ required: true, message: "Please input the service description!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                onOk={() => form.submit()}
                title="Edit Service"
                open={openModalEdit}
                onCancel={handleCloseModal}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form onFinish={updateService} form={form} layout="vertical">
                    <Form.Item
                        name="serviceName"
                        label="Service Name"
                        rules={[{ required: true, message: "Please input the service name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serviceDescription"
                        label="Description"
                        rules={[{ required: true, message: "Please input the service description!" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ServiceManagement;
