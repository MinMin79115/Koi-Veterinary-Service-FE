/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './CustomerPage.css';
import { useLocation } from 'react-router-dom';

function CustomerPage() {

  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#profile') {
      window.scrollTo(0, 180);
    }
  }, [location]);

  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const user = JSON.parse(sessionStorage.getItem("userToken"));
  useEffect(() => {
    setFullName(user.fullname);
    setAddress(user.address);
    setPhoneNumber(user.phone);
    setPassword("***");
  }, [user.address, user.fullname, user.phone]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="customer-page">
      <div className="stats">
      <div className="avatar-section">
            <img src={avatar || '/default-avatar.png'} alt="Avatar" className="avatar-preview" />
            <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div className='justify-content-center align-items-center d-flex '>
                <label htmlFor="avatar-upload" className="avatar-upload-label my-3">Change Avatar</label>
                
          </div>
      </div>
      <div className="customer-profile">
        <h1 className='text-center'>My Profile</h1>
        <div className="profile-content">
          <form className="profile-form">
            <div className="form-customer">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="form-customer">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-customer">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="tel" id="phoneNumber" name="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="form-customer">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default CustomerPage;