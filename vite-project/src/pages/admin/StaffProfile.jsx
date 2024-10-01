<<<<<<< Updated upstream
import React, { useState } from 'react';
import styles from './StaffProfile.module.css';

const StaffProfile = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [bookingRequests, setBookingRequests] = useState([]);

  const handleAddService = (e) => {
    e.preventDefault();
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleAcceptBooking = (id) => {
    setBookingRequests(bookingRequests.map(request => 
      request.id === id ? { ...request, status: 'accepted' } : request
    ));
  };

  return (
    <div className={styles.staffProfile}>
      <h1 className={styles.title}>Staff Profile</h1>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Edit Services</h2>
        <form className={styles.form} onSubmit={handleAddService}>
          <input
            className={styles.input}
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Enter new service"
          />
          <button className={styles.button} type="submit">Add Service</button>
        </form>
        <ul className={styles.serviceList}>
          {services.map((service, index) => (
            <li key={index} className={styles.serviceItem}>{service}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Booking Requests</h2>
        {bookingRequests.map((request) => (
          <div key={request.id} className={styles.bookingRequest}>
            <p className={styles.bookingInfo}>Customer: {request.customerName}</p>
            <p className={styles.bookingInfo}>Service: {request.service}</p>
            <p className={styles.bookingInfo}>Status: {request.status}</p>
            {request.status === 'pending' && (
              <button 
                className={styles.acceptButton}
                onClick={() => handleAcceptBooking(request.id)}
              >
                Accept Booking
              </button>
            )}
          </div>
        ))}
      </section>
=======
import { useEffect, useState } from 'react';
import styles from './StaffProfile.module.css';
import axios from 'axios';

const StaffProfile = () => {
  const [loggedInStaff, setLoggedInStaff] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const api = 'https://66fb5c648583ac93b40b8727.mockapi.io/staffs';

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(api);
      if (res.data.length > 0) {
        setLoggedInStaff(res.data[0]);
      }
    } catch {
      setError('Failed to fetch staff data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoggedInStaff(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      // Here you would typically send the updated information to the server
      // For now, we'll just simulate an API call with a timeout
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated staff information:', loggedInStaff);
      setSuccessMessage('Profile updated successfully!');
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.staffProfile}>
      <h1 className={styles.title}>Staff Profile</h1>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      <form onSubmit={handleSubmit} className={styles.staffForm}>
        <div className={styles.formGroup}>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={loggedInStaff.id}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={loggedInStaff.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={loggedInStaff.phone}
            onChange={handleInputChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={loggedInStaff.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={loggedInStaff.role}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
>>>>>>> Stashed changes
    </div>
  );
};

export default StaffProfile;
