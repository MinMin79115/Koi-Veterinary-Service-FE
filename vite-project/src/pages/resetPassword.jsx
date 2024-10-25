import React, { useEffect, useState } from 'react';
import  api  from '../config/axios'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function ResetPassword() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [notify, setNotify] = useState('');
    const validate = () => {
        if (formData.password !== formData.confirmPassword) {
            setNotify("Passwords do not match");
        } else {
            setNotify('');
        }
    };

    useEffect(() => {
        validate();
    }, [formData]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`auth/reset-password`, formData);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Reset Password</h1>
            <form onSubmit={onSubmit} style={{width: '70%'}} className="mx-auto p-3 border rounded shadow-sm">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                </div>
                {notify && <p className="text-danger">{notify}</p>}
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
