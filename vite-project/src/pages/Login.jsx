import React, { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { googleProvider } from '../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import api from '../config/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    const values = {
      username,
      // phone,
      password
    }
    // Set the boolean value in secureLocalStorage
    //Lấy token
    //Check token exist
    //Phân quyền authen
    //try catch finally
    //navigate to customer page
    try{
      const response = await api.post('auth/login', values);
      // const response = await api.post('login', values);

      const {role, token} = response.data
      const userProfile = response.data;
      sessionStorage.setItem("token",token)
      sessionStorage.setItem("userToken",JSON.stringify(userProfile))
      if(role === 'CUSTOMER' || role ==='VETERIAN' || role === null ){
        navigate('/')
      }else if(role === 'ADMIN'){
        navigate('/manager')
      }else if(role === 'STAFF'){
        navigate('/staff-profile')
      }
    }catch(error){
      toast.error(error.response.data);
    };
    
  };

  const handleLoginGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        sessionStorage.setItem("userToken",token)
        // IdP data available using getAdditionalUserInfo(result)
        navigate("/")
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error("Login failed");
        navigate('/login')
      })
  };
  

  return (
    <>
      <div className="login-container">
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit} className="auth-form">
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
            {/* <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div> */}
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
            <div className='form-button-login'> 
              <button type="submit" className="auth-button">Log In</button>
              <button type="button" onClick={handleLoginGoogle} className="auth-button">Google</button>
            </div>
          </form>
          <p className="auth-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <p className="auth-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;