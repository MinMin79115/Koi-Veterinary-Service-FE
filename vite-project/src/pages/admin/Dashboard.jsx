import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css'; // We'll create this for any additional custom styles
import api from '../../config/axios';
import { Table, Tag } from 'antd';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dataSource, setDataSource] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [bookingStats, setBookingStats] = useState({
    labels: ['Pond Quality', 'Fish Health', 'Interview'],
    datasets: [
      {
        label: 'Number of Bookings',
        data: [0, 0, 0], // Initialize with zeros
        backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        fontSize: 'fs-6 fs-md-5 fs-lg-4',
      },
    ],
  });

  const [serviceTypeStats, setServiceTypeStats] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);

  const columns = [
    { title: 'Booking ID', dataIndex: 'bookingId' },
    { title: 'Customer', dataIndex: 'customerName' },
    { title: 'Service', dataIndex: 'serviceName' },
    { title: 'Time', dataIndex: 'time' },
    { title: 'Status', dataIndex: 'status', render: (_, record) => <Tag color={record.status === 'COMPLETED' ? 'green' : ''}>{record.status}</Tag> },
  ];

  const customerColumns = [
    { title: 'Customer ID', dataIndex: 'customerId', width: 10 },
    { title: 'Customer', dataIndex: 'customerName', width: 50 },
    { title: 'Email', dataIndex: 'customerEmail', width: 30 },
    { title: 'Address', dataIndex: 'customerAddress', width: 400 },
    { title: 'Phone', dataIndex: 'customerPhone', width: 20 },

  ];

  const fetchBookingStats = async () => {
    try {
      const response = await api.get('bookings');

      let totalPrice = 0;
      let uniqueCustomers = new Set();
      let totalBookings = 0;

      // Reset counts
      const serviceCounts = { 1: 0, 2: 0, 3: 0 };
      const serviceTypeCounts = {};
      setDataSource([]);
      setCustomerList([]);


      response.data.forEach(booking => {
        if (booking.status === "COMPLETED") {
          const serviceId = booking.servicesDetail.serviceId.serviceId;
          const serviceType = booking.servicesDetail.serviceTypeId.service_type;
          const customerId = booking.user.id;

          if (serviceCounts[serviceId] !== undefined) {
            serviceCounts[serviceId] += 1;
          }

          if (serviceTypeCounts[serviceType] === undefined) {
            serviceTypeCounts[serviceType] = 1;
          } else {
            serviceTypeCounts[serviceType] += 1;
          }

          totalPrice += booking.servicesDetail.serviceTypeId.price;
          totalBookings += 1;
          uniqueCustomers.add(customerId);
          console.log(response.data);
          setDataSource(prevData => [...prevData, {
            bookingId: booking.bookingId,
            customerName: booking.user.fullname,
            serviceName: booking.servicesDetail.serviceTypeId.service_type,
            time: booking.serviceTime,
            status: booking.status,
          }]);
        }
      });

      const uniqueCustomersSet = new Set();
      const newCustomerList = [];

      response.data.forEach(booking => {
        if (booking.status === "COMPLETED") {
          const customerId = booking.user.id;

          // Check if the customer ID is already in the Set
          if (!uniqueCustomersSet.has(customerId)) {
            uniqueCustomersSet.add(customerId); // Add to Set to track uniqueness

            // Add the customer to the newCustomerList
            newCustomerList.push({
              customerId: customerId,
              customerName: booking.user.fullname,
              customerEmail: booking.user.email,
              customerPhone: booking.user.phone,
              customerAddress: booking.user.address,
            });
          }
        }
      });

      // Set the customer list with unique entries
      setCustomerList(newCustomerList);

      setTotalPrice(totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
      setTotalCustomer(uniqueCustomers.size);
      setTotalBooking(totalBookings);

      setBookingStats(prevStats => ({
        ...prevStats,
        datasets: [
          {
            ...prevStats.datasets[0],
            data: [serviceCounts[2], serviceCounts[1], serviceCounts[3]],
          },
        ],
      }));

      // Set service type stats for pie chart
      const serviceTypeLabels = Object.keys(serviceTypeCounts);
      const serviceTypeData = Object.values(serviceTypeCounts);
      const serviceTypeColors = serviceTypeLabels.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
      );

      setServiceTypeStats({
        labels: serviceTypeLabels,
        datasets: [
          {
            data: serviceTypeData,
            backgroundColor: serviceTypeColors,
          },
        ],
      });

    } catch (error) {
      console.error('Error fetching booking stats: ', error);
    }
  };

  useEffect(() => {
    fetchBookingStats();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Booking Statistics',
      },
    },
  };

 

  return (
    <>
      <div className="container-fluid mt-4" >
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card text-dark h-100" style={{ backgroundColor: '#E27D60' }}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-white fs-6 fs-md-5 fs-lg-4">Total Bookings</h5>
                <p className="card-text text-white mb-0 fs-1 fs-md-2 fs-lg-1">{totalBooking}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-white h-100" style={{ backgroundColor: '#AFD275' }}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-white fs-6 fs-md-5 fs-lg-4">Total Profit</h5>
                <p className="card-text text-white mb-0 fs-1 fs-md-2 fs-lg-1">{totalPrice}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-dark h-100" style={{ backgroundColor: '#E7717D' }}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-white fs-6 fs-md-5 fs-lg-4">Total Customers</h5>
                <p className="card-text text-white mb-0 fs-1 fs-md-2 fs-lg-1">{totalCustomer}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="card" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="card-body">
                <h5 className="card-title fs-6 fs-md-5 fs-lg-4">Booking Statistics by Service</h5>
                <Bar className='h-100' data={bookingStats} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 mb-3" >
            <div className="card" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="card-body">
                <h5 className="card-title fs-6 fs-md-5 fs-lg-4">Service Type Distribution</h5>
                <Pie data={serviceTypeStats} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <h1 className="table-title">Booking List</h1>
        <Table pagination={{ pageSize: 6 }} dataSource={dataSource} columns={columns} />
      </div>
      <div className="table-container">
        <h1 className="table-title">List of Typical Customers</h1>
        <Table pagination={{ pageSize: 6 }} dataSource={customerList} columns={customerColumns} />
      </div>
    </>
  );
};

export default Dashboard;
