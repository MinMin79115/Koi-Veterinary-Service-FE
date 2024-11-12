import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablePriceManagement = () => {
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
            const response = await api.get('services/type', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices(response.data);
            console.log(response.data); 
        } catch (error) {
            console.error('Error fetching services:', error.response?.data);
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


    const updateService = async (values) => {
        try {
            setSubmitting(true);
            await api.put(`/services/type/${editingService.service_typeId}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Price updated successfully');
            setOpenModalEdit(false);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update price');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = services.filter(item =>
        item.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "service_typeId",
            key: "service_typeId",
            width: "10%",
        },
        {
            title: "Type",
            dataIndex: "service_type",
            key: "service_type",
            width: "30%",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: "40%",
            render: (_, record) => (
                <span>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            )
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
                </div>
            )
        },
    ];

    const validatePrice = (_, value) => {
        if (value === null || value === undefined) {
            return Promise.reject('Please input the price!');
        }
        if (value < 50000) {
            return Promise.reject('Price cannot be less than 50,000!');
        }
        if (value > 1000000) {
            return Promise.reject('Price cannot exceed 1,000,000!');
        }
        return Promise.resolve();
    };
    
    return (
        <>
            <div className="row mb-3">
                <div className="col-12 col-md-6 col-lg-8 mb-2">
                    <Input
                        placeholder="Search service type"
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
                        rowKey="service_typeId"
                        className="w-100"
                    />
                </div>
            </div>
            <Modal
                onOk={() => form.submit()}
                title="Edit Service Price"
                open={openModalEdit}
                onCancel={handleCloseModal}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form onFinish={updateService} form={form} layout="vertical">
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[
                            {
                                validator: validatePrice
                            }
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            max={1000000}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TablePriceManagement;
