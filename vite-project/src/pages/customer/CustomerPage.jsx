/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CustomerPage.module.css';

function CustomerPage() {
  const location = useLocation();
  const [customer, setCustomer] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.hash === '#profile') {
      window.scrollTo(0, 180);
    }
    const user = JSON.parse(sessionStorage.getItem("userToken"));
    if (user) {
      setCustomer({
        fullName: user.fullname,
        address: user.address,
        phoneNumber: user.phone,
        email: user.email,
        password: "***"
      });
      setIsLoading(false);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      setIsLoading(true);
      // Here you would typically send the updated information to the server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      console.log('Updated customer information:', customer);
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
    <div className={styles.customerProfile}>
      <h2 className={styles.title}>Customer Profile</h2>
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      <div className={styles.profileContent}>
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              className={styles.formControl} 
              name="fullName" 
              value={customer.fullName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={styles.formControl} 
              name="email" 
              value={customer.email} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              className={styles.formControl} 
              name="phoneNumber" 
              value={customer.phoneNumber} 
              onChange={handleInputChange} 
              required 
              pattern="[0-9]{10}" 
              title="Please enter a valid 10-digit phone number" 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Address</label>
            <input 
              type="text" 
              className={styles.formControl} 
              name="address" 
              value={customer.address} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.formControl} 
              name="password" 
              value={customer.password} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.profileButton} type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerPage;