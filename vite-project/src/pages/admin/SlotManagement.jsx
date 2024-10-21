import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { Button, Table, Modal, Form, Input, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import api from '../../config/axios';
import { useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';

const SlotManagement = () => {
    const [slots, setSlots] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [form] = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSlot, setEditingSlot] = useState(null);

    const fetchSlots = async () => {
        try {
            const response = await api.get('veterinarian/slot', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setSlots(response.data);
        } catch (error) {
            toast.error('Error fetching slots:', error.response?.data || error.message);
        }
    };

    const fetchVeterinarians = async () => {
        try {
            const response = await api.get('veterinarian', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setVeterinarians(response.data);
        } catch (error) {
            toast.error('Error fetching veterinarians:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchSlots();
        fetchVeterinarians();
    }, []);

    const handleOpenModal = () => {
        form.setFieldsValue({
            veterinarianId: '',
            slotTimeId: '',
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        form.resetFields();
    };

    const handleOpenModalEdit = (record) => {
        setEditingSlot(record);
        form.setFieldsValue({
            slotTimeId: record.timeSlot.slotTimeId,
            veterinarianId: record.veterinarian.veterinarianId,
        });
        setOpenModalEdit(true);
    };

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
        setEditingSlot(null);
        form.resetFields();
    };

    const handleSubmitSlot = async (values) => {
        console.log(values);
        try {
            setSubmitting(true);
            await api.post('veterinarian/slot', values, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            toast.success("Slot successfully added!");
            setOpenModal(false);
            form.resetFields();
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data || "An error occurred while adding the slot.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSlot = async (values) => {
        try {
            setSubmitting(true);
            await api.put(`veterinarian/slot/${editingSlot.slotId}`, values, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            toast.success("Slot successfully updated!");
            setOpenModalEdit(false);
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data || "An error occurred while updating the slot.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`veterinarian/slot/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            toast.success("Slot deleted successfully!");
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data || "An error occurred while deleting the slot.");
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = slots.filter(item =>
        item.veterinarian.user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "Slot ID",
            dataIndex: "slotId",
            key: "slotId",
            width: "10%",
        },
        {
            title: "Slot Status",
            dataIndex: "slotStatus",
            key: "slotStatus",
            width: "15%",
        },
        {
            title: "Time Slot ID",
            dataIndex: ['timeSlot', 'slotTimeId'],
            key: "slotTimeId",
            width: "15%",
        },
        {
            title: "Veterinarian Name",
            dataIndex: ['veterinarian', 'user', 'fullname'],
            key: "veterinarianName",
            width: "25%",
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
                        title="Are you sure you want to delete this slot?"
                        onConfirm={() => handleDelete(record.slotId)}
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
        <div>
            <Button onClick={handleOpenModal}>Create new slot</Button>
            <Input
                placeholder="Search veterinarian name"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ margin: 16, width: '60%' }}
            />
            <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{ pageSize: 7 }}
                rowKey="slotId"
            />
            <Modal onOk={() => form.submit()} title="Create new Slot" open={openModal} onCancel={handleCloseModal}>
                <Form onFinish={handleSubmitSlot} form={form}>
                    <Form.Item label="Veterinarian" name="veterinarianId" rules={[{ required: true, message: "Please input veterinarian id!" }]}>
                        <Select options={veterinarians.map(veterinarian => ({
                            label: veterinarian.user.fullname,
                            value: veterinarian.veterinarianId
                        }))} />
                    </Form.Item>
                    <Form.Item label="Time Slot ID" name="slotTimeId" rules={[{ required: true, message: "Please input time slot id!" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal onOk={() => form.submit()} title="Edit Slot" open={openModalEdit} onCancel={handleCloseModalEdit}>
                <Form onFinish={handleEditSlot} form={form}>
                    <Form.Item label="Veterinarian" name="veterinarianId" rules={[{ required: true, message: "Please input veterinarian id!" }]}>
                        <Select options={veterinarians.map(veterinarian => ({
                            label: veterinarian.user.fullname,
                            value: veterinarian.veterinarianId
                        }))} />
                    </Form.Item>
                    <Form.Item label="Time Slot ID" name="slotTimeId" rules={[{ required: true, message: "Please input time slot id!" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SlotManagement;
