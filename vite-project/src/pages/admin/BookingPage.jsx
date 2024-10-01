import { useState } from 'react';
import styles from './BookingPage.module.css';
import { Button } from 'antd';

const BookingPage = () => {
    const [bookingRequests, setBookingRequests] = useState([
        { id: '1', customerName: 'HungDung', service: 'Interview', status: 'Pending' },
        { id: '2', customerName: 'hd', service: 'Health Checking', status: 'Pending' },
        { id: '3', customerName: 'mt', service: 'Pond Checking', status: 'Pending' }
    ]);

    const handleConfirmBooking = (id) => {
        setBookingRequests(bookingRequests.map(request =>
            request.id === id ? { ...request, status: 'Accepted' } : request
        ));
    };

    const handleRejectBooking = (id) => {
        setBookingRequests(bookingRequests.map(request => request.id === id ? { ...request, status: 'Rejected'} : request))
    }

    return (
        <div className={styles.bookingPage}>
            <h1 className={styles.title}>Booking Requests</h1>
            <table className={styles.bookingTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.customerName}</td>
                            <td>{request.service}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status === 'Pending' && (
                                    <>
                                        <div>
                                            <Button
                                                type='primary'
                                                onClick={() => handleConfirmBooking(request.id)}
                                            >
                                                Confirm
                                            </Button>
                                            <Button
                                                type='primary' danger
                                                onClick={() => handleRejectBooking(request.id)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingPage;