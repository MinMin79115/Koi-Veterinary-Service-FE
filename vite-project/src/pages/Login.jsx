<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { googleProvider } from '../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import api from '../config/axios';
<<<<<<< HEAD
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const values = formData
=======
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/features/userSlider';

const Login = () => {

  //Lưu data vào redux: useDispatch,
  //Lấy dữ liệu: useSelector,
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
    // Set the boolean value in secureLocalStorage
    //Lấy token
    //Check token exist
    //Phân quyền authen
    //try catch finally
    //navigate to customer page
    try{
<<<<<<< HEAD
      const response = await api.post('login', values);
      const {role} = response.data
      if(role === 'CUSTOMER'){
        navigate('/')
      }else if(role === 'ADMIN'){
        navigate('/manager')
      }else if(role === 'STAFF'){
        navigate('/staff-profile')
      }
    }catch(error){
      toast.error(error.response.data.message);
      navigate('/login')
    };
    // try{
    //   if(values.username === customer.username && values.password === customer.password){
    //     navigate('/')
    //     secureLocalStorage.setItem("userToken",JSON.stringify(customer))
    //   }else if(values.username === admin.username && values.password === admin.password){
    //     sessionStorage.setItem("userToken",JSON.stringify(admin))//Object need to parsing
    //     navigate('/manager')
    //   }else{
    //     toast.error("Invalid username or password");
    //     navigate('/login')
    //   }
    // }catch(error){
    //   toast.error(error.response.data.message);
    //   navigate('/login')
    // }
=======
      const response = await api.post('auth/login', values);
      // const response = await api.post('login', values);
      dispatch(login(response.data))
      const {role, accessToken} = response.data
      const userProfile = response.data;
      sessionStorage.setItem("token",accessToken)
      sessionStorage.setItem("userToken",JSON.stringify(userProfile))
      if(role === 'CUSTOMER' || role ==='VETERINARIAN' || role === "STAFF" ){
        navigate('/')
      }else if(role === 'ADMIN'){
        navigate('/manager')
      }
    }catch(error){
      toast.error(error.response.data);
    };
    
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD
        secureLocalStorage.setItem("userToken",token)
        // IdP data available using getAdditionalUserInfo(result)
=======
        sessionStorage.setItem("user",(user))
        sessionStorage.setItem("userToken",(token))
        // IdP data available using getAdditionalUserInfo(result)
        navigate("/")
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD
      }).finally(() => {
        // This block will run regardless of success or failure
        navigate('/customer-dashboard');
      });
=======
      })
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
  };
  

  return (
    <>
      <div className="login-container">
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
<<<<<<< HEAD
              <label htmlFor="phone">Username</label>
=======
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
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
              <input
                type="text"
                id="phone"
                name="phone"
<<<<<<< HEAD
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
=======
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div> */}
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
<<<<<<< HEAD
                value={formData.password}
                onChange={handleChange}
=======
                value={password}
                onChange={(e) => setPassword(e.target.value)}
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
                required
              />
            </div>
            <div className='form-button-login'> 
<<<<<<< HEAD
              <button type="submit" className="auth-button">Log In</button>
=======
              <button type="submit" id="loginButton" className="auth-button">Log In</button>
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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