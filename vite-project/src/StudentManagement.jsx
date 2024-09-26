/* eslint-disable no-unused-vars */
import { Modal, Table, Form, Input, Button, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useForm } from 'antd/es/form/Form';
import { toast } from 'react-toastify';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';


function StudentManagement() {
    //Quản lí sinh viên
    //1. Seen list
    //2. Add new
    //3.Update
    //4. Delete

    //api url
    const api = "https://66eec7d23ed5bb4d0bf1f314.mockapi.io/Students"
    
    const [students, setStudents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [form] = useForm();
    const [submitting, setSubmitting] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);


    const fetchStudent = async () =>{
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
      },[]);

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
    ];

    const handleOpenModal = () => {
      setOpenModal(true);
    }

    const handleCloseModal = () => {
      setOpenModal(false);
    }

    const handleSubmitStudent = async (values) =>{
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
        }finally{
          setSubmitting(false);
        }
    }

    const getBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
      };
      const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
      const uploadButton = (
        <button
          style={{
            border: 0,
            background: 'none',
          }}
          type="button"
        >
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </button>
      );
  return (
    <div>
      <h1>Student Management</h1>
      <Button onClick={handleOpenModal}>Create new student</Button>
      <Table columns={columns} dataSource={students}/>
      {/* onCancel: Bấm ra ngoài thì hành động được chạy */}
      {/* onOK: Chạy hàm trong Modal */}
      <Modal onOk={()=> form.submit()} title="Create new Student" open={openModal} onCancel={handleCloseModal}>
        {/* name: tên biến trùng (phù hợp) với DB */}
        {/* rule: Định nghĩa validation => [] */}
        <Form onFinish={handleSubmitStudent} form={form}>
           <Form.Item label="Student name" name="name" rules={[
            {
              required: true,
              message: "Please input your name !"
            }
           ]}>
            <Input/>
           </Form.Item>
           <Form.Item label="Student's code" name="code" rules={[
            {
              required: true,
              message: "Please input your student's code !"
            },
            {
              pattern: '^SE\\d{6}$',
              message: "Invalid format!"
            }
           ]}>
            <Input placeholder='SE18xxxx'/>
           </Form.Item>
           <Form.Item label="Score" name="score" rules={[
            {
              required: true,
              message: "Please input your score !"
            },
            {
              type: 'number',
              min: 0,
              max: 10,
              message: "Invalid score!"
            }
           ]}>
            <InputNumber step={0.5}/>
           </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StudentManagement