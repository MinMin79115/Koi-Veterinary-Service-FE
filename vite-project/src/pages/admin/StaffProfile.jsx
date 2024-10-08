import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './StaffProfile.module.css';
import api from '../../config/axios';
import { toast } from 'react-toastify';

const StaffProfile = () => {
  // const api = 'https://66fb5c648583ac93b40b8727.mockapi.io/staffs';

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    const userToken = JSON.parse(sessionStorage.getItem('userToken'));
    setStaffs(userToken);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffs(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`customers/${staffs.id}`, staffs, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log('Updated staff information:', staffs);
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };


  return (
    <div className={`${styles.staffProfile} container mt-5`}>
      <h2 className={`${styles.title} text-center mb-4`}>Profile</h2>
      <div className="row">
        <div className="col-md-4">
          <div className={`${styles.avatarSection} text-center`}>
            <img
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Staff"
              className={`${styles.avatarPreview} img-fluid rounded-circle mb-3`}
            />
            <h4>{staffs.name}</h4>
            <p className="text-muted">Staff</p>
          </div>
        </div>
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className={styles.labels}>Full name</label>
                <input
                  type="text"
                  className={styles.formControl}
                  name="name"
                  value={staffs.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={styles.labels}>Staff ID</label>
                <input
                  type="text"
                  className={`${styles.formControl} ${styles.readOnlyInput}`}
                  value={staffs.id}
                  readOnly
                />
              </div>
            </div>
            <div className="mb-3">
              <label className={styles.labels}>Email</label>
              <input
                type="email"
                className={styles.formControl}
                name="email"
                value={staffs.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className={styles.labels}>Password</label>
              <input
                className={styles.formControl}
                name="password"
                value={staffs.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className={styles.labels}>Phone Number</label>
              <input
                type="tel"
                className={styles.formControl}
                name="phone"
                value={staffs.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="mb-3">
              <label className={styles.labels}>Address</label>
              <input
                type="text"
                className={styles.formControl}
                name="address"
                value={staffs.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="text-center mt-4">
              <button className={`${styles.profileButton} btn btn-primary`} type="submit" >
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;