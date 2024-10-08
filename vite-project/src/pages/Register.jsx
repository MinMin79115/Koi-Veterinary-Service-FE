import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import api from '../config/axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    const values = {
      username,
      email,
      phone,
      fullname,
      password,
      confirmPassword
    };
    
    try {
      // const response = await api.post('auth/register', values)
      const response = await api.post('auth/register', values)
      console.log(response);
      toast.success('Register Success !')
      navigate('/login')
    } catch (err) {
      toast.error(err.response.data)
    }
  };

  return (
    <div className="register-container">
      <div className="auth-container-register">
        <div className="auth-form-container-register">
          <form onSubmit={handleSubmit} className="auth-form">
            <Row>
              <Col xs={5}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
              </Col>
            </Row>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Phone" >Phone</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='+84'
                required
              />
            </div>
            <Row>
              <Col xs={6}>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </Col>
            </Row>
            <button type="submit" className="auth-button">Register</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;