import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CareGuide from './pages/about/CareGuide';
import WaterQuality from './pages/about/WaterQuality';
import FishTypes from './pages/about/FishTypes';
import Contact from './pages/about/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerPage from './pages/customer-staff/CustomerPage';
import Booking from './pages/service/Booking';
import Services from './pages/service/Services';
import Manager from './pages/admin/Manager';
import AboutUs from './pages/about/AboutUs'; // Add this line
import StaffManagement from './pages/admin/StaffManagement';
import NotFound from './pages/NotFound';
import FAQManagement from './pages/customer-staff/FAQ';
import BookingManagement from './pages/booking/BookingManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import SlotManagement from './pages/admin/SlotManagement';
import BookingDetail from './pages/booking/BookingDetail';
import PaySuccess from './pages/payment/paySuccess';
import PaymentDetail from './pages/payment/paymentDetail';
import ForgotPassword from './pages/forgotPassword'
import ResetPassword from './pages/resetPassword'
import FeedbackManagement from './pages/customer-staff/FeedbackManagement';
import TablePrice from './pages/about/TablePrice';
const App = () => {

  const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user);
    if (user && user?.role === 'ADMIN') {
      return children;
    }
    alert('You dont have permission to access this page');
    return <Navigate to="/" />;
  }

  const ProtectedRouteCustomer = ({ children }) => {
    const user = useSelector((state) => state.user);
    if (user && user?.role === 'CUSTOMER' || user?.role === "VETERINARIAN" || user?.role === "STAFF") {
      return children;
    }else{
      alert('You dont have permission to access this page');
    }
    return <Navigate to="/" />;
  }

  const ProtectedRouteStaff = ({ children }) => {
    const user = useSelector((state) => state.user);
    if (user && user?.role === 'STAFF') {
      return children;
    }
    alert('You dont have permission to access this page');
    return <Navigate to="/" />;
  }

  

  return (
    <Router>
      <Routes>
        {/* Routes without Header and Footer */}
        <Route path='/manager' element={<ProtectedRoute><Manager /></ProtectedRoute>} />
        <Route path="/staff-management" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
        <Route path="/service-management" element={<ProtectedRoute><ServiceManagement/></ProtectedRoute>}/>
        <Route path="/service-management" element={<ProtectedRoute><SlotManagement/></ProtectedRoute>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<PaySuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/payment-detail" element={<PaymentDetail />} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        {/* Routes with Header and Footer */}
        <Route element={
          <div className="App">
            <div className="page-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/care-guide" element={<CareGuide />} />
                  <Route path="/water-quality" element={<WaterQuality />} />
                  <Route path="/fish-types" element={<FishTypes />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/table-of-prices" element={<TablePrice />} />
                  <Route path="/booking-management" element={<ProtectedRouteStaff><BookingManagement/></ProtectedRouteStaff>}/>
                  <Route path="/faq-management" element={<ProtectedRouteStaff><FAQManagement/></ProtectedRouteStaff>}/>
                  <Route path="/feedback-management" element={<ProtectedRouteStaff><FeedbackManagement/></ProtectedRouteStaff>}/>
                  <Route path="/customer-profile" element={<ProtectedRouteCustomer><CustomerPage /></ProtectedRouteCustomer>} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking-detail" element={<BookingDetail />} />
                  <Route path="/about" element={<AboutUs />} />

                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        }>
          <Route index element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/care-guide" element={<CareGuide />} />
          <Route path="/water-quality" element={<WaterQuality />} />
          <Route path="/fish-types" element={<FishTypes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/table-of-prices" element={<TablePrice />} />
          <Route path="/customer-profile" element={<CustomerPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/booking-management" element={<BookingManagement />} />
          <Route path="/faq-management" element={<FAQManagement />} />
          <Route path="/feedback-management" element={<FeedbackManagement />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* NotFound route without Header and Footer */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
