import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css'; // We'll create this for any additional custom styles
import api from '../../config/axios';
import { Table, Tag } from 'antd';
import { useSelector } from 'react-redux';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const token = useSelector((state) => state.accessToken);
  const [dataSource, setDataSource] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [bills, setBills] = useState([]);
  const sortBooking = dataSource.sort((a, b) => b.bookingId - a.bookingId);
  const sortCustomer = customerList.sort((a, b) => b.customerId - a.customerId);
  const sortBills = bills.sort((a, b) => b.ID - a.ID);
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

  const [weeklyProfits, setWeeklyProfits] = useState({
    labels: [],
    datasets: [
      {
        label: 'Weekly Profit',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

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

  const columnsBill = [
    { title: 'ID', dataIndex: 'ID' },
    { title: 'BookingId', dataIndex: 'BookingId'  },
    {title: 'Customer', dataIndex: 'Customer'},
    { title: 'Date', dataIndex: 'Date' },
  ];

  const fetchBills = async () => {
    try{

      const response = await api.get(`payment`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setBills([])
      response.data.forEach(payment => {
      setBills(prevData => [...prevData, {
        ID: payment.billId,
        BookingId: payment.booking.bookingId,
        Customer: payment.booking.user.fullname,
        Date: payment.paymentDate.replace('T', ' at ')+[]
      }])
    })
    console.log(bills)
    }catch(error){
      console.log(error)
    }
  }

  const calculateWeeklyProfits = (bookings) => {
    const weeklyData = {};
    
    bookings.forEach(booking => {
      if (booking.status === "COMPLETED") {
        const date = new Date(booking.serviceTime);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
        
        if (!weeklyData[weekStart]) {
          weeklyData[weekStart] = 0;
        }
        weeklyData[weekStart] += booking.servicesDetail.serviceTypeId.price;
      }
    });

    // Sort weeks and get last 8 weeks
    const sortedWeeks = Object.keys(weeklyData).sort().slice(-8);
    
    setWeeklyProfits({
      labels: sortedWeeks.map(date => {
        const [year, month, day] = date.split('-');
        return `${month}/${day}`;
      }),
      datasets: [
        {
          label: 'Weekly Profit (VND)',
          data: sortedWeeks.map(week => weeklyData[week]),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    });
  };

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

      calculateWeeklyProfits(response.data);

    } catch (error) {
      console.error('Error fetching booking stats: ', error);
    }
  };

  useEffect(() => {
    fetchBookingStats();
    fetchBills();
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

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Profit Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          }
        }
      }
    }
  };

  return (
    <>
      <div className="container-fluid my-6" >
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
        <div className="row d-flex align-items-center justify-content-around mt-3">
          <div className="col-lg-8 col-md-12">
            <div className="card" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="card-body">
                <h5 className="card-title fs-6 fs-md-5 fs-lg-4">Booking Statistics by Service</h5>
                <Bar className='h-100' data={bookingStats} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-8" >
            <div className="card" style={{ height: 'calc(100vh - 200px)'}}>
              <div className="card-body">
                <h5 className="card-title">Service Type Distribution</h5>
                <Pie data={serviceTypeStats} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="row mb-4">
          <div className="col-12 mt-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Weekly Profit Trend</h5>
                <Line data={weeklyProfits} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div className="table-container mt-6">
        <h1 className="table-title">Booking List</h1>
        <Table pagination={{ pageSize: 6 }} dataSource={sortBooking} columns={columns} />
      </div>
      <div className="table-container">
        <h1 className="table-title">List of Typical Customers</h1>
        <Table pagination={{ pageSize: 6 }} dataSource={sortCustomer} columns={customerColumns} />
      </div>
      <div className="table-container">
        <h1 className="table-title">History Payment</h1>
        <Table pagination={{ pageSize: 6 }} dataSource={sortBills} columns={columnsBill} />
      </div>
    </>
  );
};

export default Dashboard;
