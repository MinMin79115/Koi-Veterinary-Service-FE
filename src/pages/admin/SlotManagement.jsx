import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Popconfirm, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

const SlotManagement = () => {
    const user = useSelector(state => state.user)
    const token = useSelector(state => state.user.accessToken);
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
            setSlots([]);
            const response = await api.get('veterinarian/slot', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data)
            const fetchedSlots = []; // Create an array to hold the fetched slots
            response.data.forEach(slot => {
                if (slot.slotStatus !== "DELETED") {
                    fetchedSlots.push({ // Push each valid slot into the array
                        veterinarianId: slot.veterinarian?.veterinarianId,
                        slotId: slot.slotId,
                        slotStatus: slot.slotStatus,
                        timeSlotId: slot.timeSlot?.slotTimeId,
                        fullName: slot.veterinarian?.user?.fullname,
                    });
                }
            });
            setSlots(fetchedSlots);
            console.log(slots)
        } catch (error) {
            console.log('Error fetching slots:', error.response?.data || error.message);
        }
    };

    const fetchVeterinarians = async () => {
        try {
            const response = await api.get('veterinarian', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const filteredVeterinarians = response.data.filter(veterinarian =>
                veterinarian.serviceTypeId === null
            );
            setVeterinarians(filteredVeterinarians);
            console.log(filteredVeterinarians);
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    useEffect(() => {
        fetchSlots();
        fetchVeterinarians();
    }, []);

    const handleOpenModal = () => {
        form.setFieldsValue({
            veterinarianId: '',
            timeSlotId: '',
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
            timeSlotId: record.timeSlotId,
            veterinarianId: record.veterinarianId,
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
                    Authorization: `Bearer ${token}`
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
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Slot successfully updated!");
            setOpenModalEdit(false);
            setEditingSlot(null);
            form.resetFields();
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data || "An error occurred while updating the slot.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (record) => {
        const values = {
            veterinarianId: record?.veterinarianId,
            slotTimeId: record?.timeSlotId,
            status: "DELETED"
        }
        try {
            const res = await api.put(`veterinarian/slot/${record.slotId}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Slot deleted successfully!");
            console.log(res)
            fetchSlots();
        } catch (err) {
            console.log(err)
            toast.error(err || "Error while delete booking!");
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredData = slots.filter(item =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredData.sort((a, b) => b.slotId - a.slotId);
    const columns = [
        {
            title: '',
            dataIndex: "veterinarianId",
            key: "veterinarianId",
            hidden: user?.role === "ADMIN"
        },
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
            title: "Slot Number",
            dataIndex: ['timeSlotId'],
            key: "slotTimeId",
            width: "15%",
        },
        {
            title: "Veterinarian Name",
            dataIndex: ['fullName'],
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
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </div>
            )
        },
    ];

    const validateSlotTimeId = (_, value) => {
        if (!value) {
            return Promise.reject('Please input the time slot ID!');
        }
        if (!/^\d+$/.test(value)) {
            return Promise.reject('Time slot ID must be a number!');
        }
        return Promise.resolve();
    };

    return (
        <> <div className="row mb-3">
            <div className="col-12 col-md-6 col-lg-4 mb-2">
                <Button onClick={handleOpenModal} className="w-100">Create new slot</Button>
            </div>
            <div className="col-12 col-md-6 col-lg-8 mb-2">
                <Input
                    placeholder="Search veterinarian name"
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
                        rowKey="slotId"
                        className="w-100"
                    />
                </div>
            </div>
            <Modal
                onOk={() => form.submit()}
                title="Create new Slot"
                open={openModal}
                onCancel={handleCloseModal}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form onFinish={handleSubmitSlot} form={form} layout="vertical">
                    <Form.Item
                        label="Veterinarian"
                        name="veterinarianId"
                        rules={[{ required: true, message: "Please select a veterinarian!" }]}
                    >
                        <Select options={veterinarians.map(veterinarian => ({
                            label: veterinarian.user.fullname,
                            value: veterinarian.veterinarianId
                        }))} />
                    </Form.Item>
                    <Form.Item
                        label="Slot Number:"
                        name="slotTimeId"
                        rules={[{
                            required: true, validator: validateSlotTimeId
                        }]}>
                        <Select options={[{label: 1, value: 1}, {label: 2, value: 2}, {label: 3, value: 3}, {label: 4, value: 4}]} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                onOk={() => form.submit()}
                title="Edit Slot"
                open={openModalEdit}
                onCancel={handleCloseModalEdit}
                width="90%"
                style={{ maxWidth: '600px' }}
            >
                <Form onFinish={handleEditSlot} form={form} layout="vertical">
                    <Form.Item
                        label="Veterinarian"
                        name="veterinarianId"
                        rules={[{ required: true, message: "Please select a veterinarian!" }]}
                    >
                        <Select options={veterinarians.map(veterinarian => ({
                            label: veterinarian.user.fullname,
                            value: veterinarian.veterinarianId
                        }))} />
                    </Form.Item>
                    <Form.Item
                        label="Time Slot ID"
                        name="slotTimeId"
                        rules={[{ validator: validateSlotTimeId }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default SlotManagement;
