import React, { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { googleProvider } from '../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import secureLocalStorage from 'react-secure-storage';

const Login = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (values) => {
    
    // Set the boolean value in secureLocalStorage
    //Lấy token
    //Check token exist
    //Phân quyền authen
    //try catch finally
    //navigate to customer page
    try{
      const response = await api.post('/login', values);
      secureLocalStorage.setItem("userToken",response.data.token)
      const {role} = response.data
      if(role.name === 'Customer'){
        navigate('/')
      }else if(role.name === 'Admin'){
        navigate('/manager')
      }
    }catch(error){
      toast.error(error.response.data.message);
      navigate('/login')
    }
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
        secureLocalStorage.setItem("userToken",token)
        // IdP data available using getAdditionalUserInfo(result)
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
      }).finally(() => {
        // This block will run regardless of success or failure
        navigate('/customer-dashboard');
      });
  };
  

  return (
    <>
      <div className="login-container">
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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