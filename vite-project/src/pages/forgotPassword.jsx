import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../config/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  
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
      const res = await api.post(`mail/send/${email}`, format);
      console.log(res);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
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
          <button type="submit" className="btn btn-primary w-100">Send</button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword;
