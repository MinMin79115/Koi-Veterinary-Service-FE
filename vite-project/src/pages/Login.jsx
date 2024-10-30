import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { googleProvider } from '../config/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import api from '../config/axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/features/userSlider';

const Login = () => {

  //Lưu data vào redux: useDispatch,
  //Lấy dữ liệu: useSelector,
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear the user state
      dispatch(logout());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

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
      dispatch(login(response.data))
      toast.success('Login successfully.')
      const {role} = response.data
      if(role === 'CUSTOMER' || role ==='VETERINARIAN' || role === "STAFF" ){
        navigate('/')
      }else if(role === 'ADMIN'){
        navigate('/manager')
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
              <button type="submit" id="loginButton" className="auth-button">Log In</button>
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
