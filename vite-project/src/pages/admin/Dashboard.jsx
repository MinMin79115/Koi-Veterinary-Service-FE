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
  const [bookingStats, setBookingStats] = useState({
    labels: ['Pond Check Quality', 'Take Care of Fish', 'Interview with Customer'],
    datasets: [
      {
        label: 'Number of Bookings',
        data: [0, 0, 0], // Initialize with zeros
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
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

  const fetchBookingStats = async () => {
    try {
      const response = await api.get('bookings');
      let totalPrice = 0;
      let uniqueCustomers = new Set();
      let totalBookings = 0;

      // Reset counts
      const serviceCounts = { 1: 0, 2: 0, 3: 0 };
      const serviceTypeCounts = {};
    
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
        }
      });

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
    <div className="container-fluid mt-4" >
      <div className="row mb-4">
        <div className="col-md-4 ">
          <div className="card text-dark" style={{backgroundColor: '#E27D60'}}>
            <div className="card-body">
              <h5 className="card-title text-white">Total Bookings</h5>
              <p className="card-text display-3 text-white" >{totalBooking}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4" >
          <div className="card text-white"  style={{backgroundColor: '#AFD275'}}>
            <div className="card-body">
              <h5 className="card-title text-white">Total Profit</h5>
              <p className="card-text display-3 text-white">{totalPrice}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 ">
          <div className="card text-dark" style={{backgroundColor: '#E7717D'}}>
            <div className="card-body">
              <h5 className="card-title text-white">Total Customers</h5>
              <p className="card-text display-3 text-white">{totalCustomer}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card" style={{ height: 'calc(100%)' }}>
            <div className="card-body">
              <h5 className="card-title">Booking Statistics by Service</h5>
              <Bar data={bookingStats} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3" xs={12} sm={4} md={4}>
          <div className="card " style={{ height: 'calc(100% + 16px)' }}>
            <div className="card-body">
              <h5 className="card-title">Service Type Distribution</h5>
              <Pie data={serviceTypeStats} options={chartOptions} />
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
