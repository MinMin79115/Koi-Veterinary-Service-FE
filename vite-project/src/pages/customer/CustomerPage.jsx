/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CustomerPage.module.css';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function CustomerPage() {
  const location = useLocation();
  const user = useSelector((state) => state.user)
  const [customer, setCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.hash === '#profile') {
      window.scrollTo(0, 180);
    }
  }, [location]);


  const fetchCustomer = async () =>{
    const userToken = JSON.parse(sessionStorage.getItem('userToken'));
    setCustomer(userToken);
  }

  useEffect(() => {
    // const user = JSON.parse(sessionStorage.getItem("userToken"));
    fetchCustomer();
    setIsLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await api.put(`customers/${customer.id}`, customer, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Updated customer information:', response.data);
      toast.success('Profile updated successfully!');
      // Optionally update the Redux store or local state here
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
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
                  <h6 className={styles.fW600}>{customer.fullname}</h6>
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
                            name="fullname"
                            value={customer.fullname}
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
                            name="phone"
                            value={customer.phone}
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