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
    </div>
  );
};

export default StaffProfile;
