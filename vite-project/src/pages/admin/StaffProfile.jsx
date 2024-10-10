import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './StaffProfile.module.css';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const StaffProfile = () => {

  const user = useSelector((state) => state.user);
  const [staff, setStaff] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (location.hash === '#profile') {
      window.scrollTo(0, 180);
    }
  }, [location]);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`customers/${user.id}`);
      setStaff(response.data);
      console.log('Fetched staff data:', response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to load customer data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user && user.id) {
      fetchStaff();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaff(prevState => {
      const newState = { ...prevState, [name]: value };
      console.log('Updated staff state:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      console.log('Submitting staff data:', staff);
      const response = await api.put(`customers/${staff.id}`, {
        ...staff,
        fullname: staff.fullname // Explicitly include fullname
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      console.log('Server response:', response.data);
      toast.success('Update successful.');
      fetchStaff(); // Refresh the data after update
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className={`${styles.title} text-center mb-4`}>Profile</h2>
      <div className="row">
        <div className="col-md-4">
          <div className={`${styles.avatarSection} text-center`}>
            <img
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="Staff"
              className={`${styles.avatarPreview} img-fluid rounded-circle mb-3`}
            />
            <h4>{staff.fullname}</h4>
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
                  name="fullname"
                  value={staff.fullname || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className={styles.labels}>Staff ID</label>
                <input
                  type="text"
                  className={`${styles.formControl} ${styles.readOnlyInput}`}
                  value={staff.id}
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
                value={staff.email}
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
                value={staff.phone}
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
                value={staff.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="text-center mt-4">
              <button className={`${styles.profileButton}`} type="submit" >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StaffProfile;