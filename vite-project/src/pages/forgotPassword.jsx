import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../config/axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSend = async (e) => {
    e.preventDefault();
    const format = {
      subject: 'Forgot Password',
      body: `<html><body>
      <h1>Are you forgot your password?</h1>
      <p>Click the link below to reset your password: <a href="http://localhost:5173/reset-password/">Reset Password</a></p>
      </body>
      </html>`
    }
    try {
      setIsLoading(true);
      const res = await api.post(`mail/send/${email}`, format);
      setEmail('');
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }finally{
      setIsLoading(false);
      navigate("/login");
    }
  }

  return (
    <><div className='m-3'>
      <Link to="/login" className='text-decoration-none p-2 bg-primary text-white rounded'>Back to Login</Link>
    </div>
      <div className="container py-5 d-flex justify-content-center">
        <div className=" p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
          <h1 className="text-center mb-4">Forgot Password</h1>
          <form onSubmit={handleSend}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword;
