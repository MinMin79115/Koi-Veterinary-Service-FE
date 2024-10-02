/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import styles from './CustomerPage.module.css';
import api from '../../api/axios';
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
        password: "********"
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
      await api.put(`api/customers/${customer.id}`, customer);
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
    <div className={`bg-white shadow`} id="page-content">
      <div className={`${styles.padding} m-5`}>
        <div className={`row container d- flex justify-content-center `}>
            <div className={`${styles.card} ${styles.userCardFull}`}>
              <div className={`row ${styles.mL0} ${styles.mR0}`}>
                <div className={`col-sm-4 ${styles.bgCLiteGreen} ${styles.userProfile}`}>
                  <div className={`${styles.cardBlock} text-center text-white`}>
                    <div className={styles.mB25}>
                      <img src="https://img.icons8.com/bubbles/100/000000/user.png" className={styles.imgRadius} alt="User-Profile" />
                    </div>
                    <h6 className={styles.fW600}>{customer.fullName}</h6>
                    <p>Customer</p>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className={styles.cardBlock}>
                    <h3 className={`mb-2 ${styles.pB5} ${styles.bBDefault} ${styles.fW600}`}>Information</h3>
                    <form onSubmit={handleSubmit} >
                      <div className={`row`}>
                        <div className={`col-md-12`}>
                          <div className={styles.formGroup}>
                            <p className={`${styles.mB10} ${styles.fW600}`}>Full Name</p>
                            <input
                              type="text"
                              className={`${styles.formControl} ${styles.textMuted} ${styles.fW400}`}
                              name="fullName"
                              value={customer.fullName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className={`col-md-6`}>
                          <div className={styles.formGroup}>
                            <p className={`mb-1 ${styles.fW600}`}>Email</p>
                            <input
                              type="email"
                              className={`${styles.formControl} ${styles.textMuted} ${styles.fW400}`}
                              name="email"
                              value={customer.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className={`col-md-6 mx-auto`}>
                          <div className={styles.formGroup}>
                            <p className={`mb-1 ${styles.fW600}`}>Phone</p>
                            <input
                              type="tel"
                              className={`${styles.formControl} ${styles.textMuted} ${styles.fW400}`}
                              name="phoneNumber"
                              value={customer.phoneNumber}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`row`}>
                        <div className={`col-md-12`}>
                          <div className={styles.formGroup}>
                            <p className={`${styles.mB10} ${styles.fW600}`}>Address</p>
                            <input
                              type="text"
                              className={`${styles.formControl} ${styles.textMuted} ${styles.fW400}`}
                              name="address"
                              value={customer.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      {error && <div className={styles.error}>{error}</div>}
                      {successMessage && <div className={styles.success}>{successMessage}</div>}
                      <div className={styles.mT20}>
                        <button type="submit" className={styles.updateButton} disabled={isLoading}>
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;