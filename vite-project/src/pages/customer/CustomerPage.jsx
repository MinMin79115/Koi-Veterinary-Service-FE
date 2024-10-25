/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CustomerPage.module.css';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { SendOutlined } from '@ant-design/icons'
import userImage from '../../assets/user.png'
import { updateUser } from '../../redux/features/userSlider';
import { useDispatch } from 'react-redux';
function CustomerPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [customer, setCustomer] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (location.hash === '#profile') {
      window.scrollTo(0, 180);
    }
  }, [location]);

  const fetchCustomer = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await api.get(`customers/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { fullname, email, phone, address } = response.data;
      const userProfile = {
        fullname: fullname,
        email: email,
        phone: phone,
        address: address,
      };
      setCustomer(userProfile);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to load customer data. Please try again.');
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCustomer();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update customer state
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));

    // If the updated field is phone and the role is STAFF or VETERINARIAN, update username
    if (name === 'phone' && (user.role === 'STAFF' || user.role === 'VETERINARIAN')) {
      setCustomer(prevState => ({
        ...prevState,
        username: value // Update username to the new phone number
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updatedCustomer = { ...customer };

      if (newPassword.trim() !== '') {
        updatedCustomer.password = newPassword;
      }

      console.log(updatedCustomer);
      const response = await api.put(`customers/${user.id}`, updatedCustomer, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(updateUser(response.data));
      console.log('Updated customer information:', response.data);
      toast.success('Profile updated successfully!');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={`bg-white shadow my-2`} id="page-content">
      {user.role === "CUSTOMER" || user.role === "VETERINARIAN" ? (
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-end align-items-center my-4">
            <SendOutlined className="me-2" />
            <Link className="btn btn-outline-info btn-sm me-2" to="/booking-detail">
              View Booking History
            </Link>
          </div>
        </div>
      ) : (
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-end align-items-center my-4">
            <SendOutlined className="me-2" />
            <Link className="btn btn-outline-info btn-sm me-2" to="/booking-management">
              Manage Bookings
            </Link>
          </div>
        </div>
      )}
      <div className={`${styles.padding} m-5`}>
        <div className={`row container d-flex justify-content-center `}>
          <div className={`${styles.card} ${styles.userCardFull}`}>
            <div className={`row ${styles.mL0} ${styles.mR0}`}>
              <div className={`col-sm-4 ${styles.bgCLiteGreen} ${styles.userProfile}`}>
                <div className={`${styles.cardBlock} text-center text-white`}>
                  <div className={styles.mB25}>
                    <img src={userImage} className={styles.imgRadius} alt="User-Profile" />
                  </div>
                  <h6 className={styles.fW600}>{customer.fullname}</h6>
                </div>
              </div>
              <div className="col-sm-8">
                <div className={styles.cardBlock}>
                  <h3 className={`mb-2 ${styles.pB5} ${styles.bBDefault} ${styles.fW600}`}>Information</h3>
                  <form onSubmit={handleSubmit}>
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
                            
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`col-md-12`}>
                      <div className={styles.formGroup}>
                        <p className={`mb-1 ${styles.fW600}`}>Password</p>
                        <input
                          type="password"
                          className={`${styles.formControl} ${styles.textMuted} ${styles.fW400}`}
                          name="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
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
                            
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.mT20}>
                      <button type="submit" className={styles.updateButton}>
                        Update
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
