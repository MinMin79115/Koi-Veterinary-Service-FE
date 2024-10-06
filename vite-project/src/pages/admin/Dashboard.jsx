import React, { useState, useEffect } from 'react';
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

  const fetchBookingStats = async () => {
    try {
      // const response = await api.get('booking-stats');

      // setBookingStats(prevStats => ({
      //   ...prevStats,
      //   datasets: [{
      //     ...prevStats.datasets[0],
      //     data: data.map(stat => stat.count),
      //   }],
      // }));
    } catch (error) {
      console.error('Error fetching booking stats: ', error);
    }
  };

  const [bookingStats, setBookingStats] = useState({

    labels: ['Pond Check Quality', 'Take Care of Fish', 'Interview with Customer'],
    datasets: [
      {
        label: 'Number of Bookings',
        data: [10, 20, 30],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  });


  useEffect(() => {
    // Fetch booking statistics from your API
    // fetchBookingStats();
  }, []);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
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
    <div className="container-fluid mt-4">      
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Total Bookings</h5>
              <p className="card-text display-4">100</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Profit</h5>
              <p className="card-text display-4">10.000.000 VND</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Customers</h5>
              <p className="card-text display-4">34</p>
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