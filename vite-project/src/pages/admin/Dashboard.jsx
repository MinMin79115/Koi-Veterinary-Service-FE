import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
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
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  });

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
  }, []);

  const chartOptions = {
    responsive: true,
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