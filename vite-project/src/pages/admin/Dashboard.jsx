import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Col, Row } from 'antd';
import './AdminPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const Dashboard = () => {

  const [bookingStats, setBookingStats] = useState({
    labels: ['Service Type 1', 'Service Type 2', 'Service Type 3'],
    datasets: [
      {
        label: 'Number of Bookings',
        //Data (number of bookings for each service type)
        //Chưa có data
        data: [0, 0, 0],
=======
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css'; // We'll create this for any additional custom styles
import api from '../../config/axios';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [bookingStats, setBookingStats] = useState({
    labels: ['Pond Check Quality', 'Take Care of Fish', 'Interview with Customer'],
    datasets: [
      {
        label: 'Number of Bookings',
        data: [0, 0, 0], // Initialize with zeros
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  });

<<<<<<< HEAD
  useEffect(() => {
    // Fetch booking statistics from your API
    const fetchBookingStats = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch('/api/booking-stats');
        const data = await response.json();

        setBookingStats(prevStats => ({
          ...prevStats,
          datasets: [{
            ...prevStats.datasets[0],
            data: data.map(stat => stat.count),
          }],
        }));
      } catch (error) {
        console.error('Error fetching booking stats:', error);
      }
    };

    // fetchBookingStats();
=======
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const serviceCounts = { 1: 0, 2: 0, 3: 0 };

  const fetchBookingStats = async () => {
    try {
      const response = await api.get('bookings');
      let totalPrice = 0;
      let uniqueCustomers = new Set();
      let totalBookings = 0;

      response.data.forEach(booking => {
        const serviceId = booking.servicesDetail.serviceId.serviceId;
        const customerId = booking.user.id;
        //Tính tổng giá tiền của tất cả các dịch vụ đã được book
        totalPrice += booking.servicesDetail.serviceTypeId.price;
        //Tính tổng số lượng booking
        totalBookings += 1;

        //Đếm số lượng từng loại dịch vụ đã được book dựa theo serviceId
        if (serviceCounts[serviceId] !== undefined) {
          serviceCounts[serviceId] += 1;
        }
        //Set nó tự sắp xếp và loại bỏ phần tử trùng lặp
        uniqueCustomers.add(customerId);
      });

      setTotalPrice(totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
      setTotalCustomer(uniqueCustomers.size);
      setTotalBooking(totalBookings);

      // Update the bookingStats state with the new data
      setBookingStats(prevStats => ({
        ...prevStats,
        datasets: [
          {
            ...prevStats.datasets[0],
            data: [serviceCounts[2], serviceCounts[1], serviceCounts[3]], // Order based on labels
          },
        ],
      }));

      console.log(response.data);
    } catch (error) {
      console.error('Error fetching booking stats: ', error);
    }
  };

  useEffect(() => {
    fetchBookingStats();
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
  }, []);

  const chartOptions = {
    responsive: true,
<<<<<<< HEAD
=======
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Booking Statistics by Service Type',
      },
    },
  };

  return (
<<<<<<< HEAD
      <>
      <div className='dashboard-container'>

       
        <Row className='dashboard-row'>
          <Col span={8}>
          <div className='dashboard-card'>
            <h3>Total Bookings</h3>
            <p>100</p>
          </div>
          </Col>
          <Col span={8}>
          <div className='dashboard-card'>
            <h3>Total Profit</h3>
            <p>10.000.000 VND</p>
          </div>
          </Col>
          <Col span={8}>
          <div className='dashboard-card'>
            <h3>Total Customers</h3>
            <p>34</p>
          </div>
          </Col>
        </Row>
        
        </div>

      <div className="chart-container">
        <Bar data={bookingStats} options={chartOptions} />
      </div>
    </>
  );
};

export default Dashboard;
=======
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-dark bg-warning">
            <div className="card-body">
              <h5 className="card-title">Total Bookings</h5>
              <p className="card-text display-4">{totalBooking}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Profit</h5>
              <p className="card-text display-4">{totalPrice}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-dark bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Customers</h5>
              <p className="card-text display-4">{totalCustomer}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Booking Statistics</h5>
              <Bar data={bookingStats} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
