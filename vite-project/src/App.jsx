// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CareGuide from './pages/about/CareGuide';
import WaterQuality from './pages/about/WaterQuality';
import FishTypes from './pages/about/FishTypes';
import Contact from './pages/about/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerPage from './pages/customer/customerPage';
import StaffPage from './pages/admin/StaffProfile';
import Booking from './pages/service/Booking';
import Services from './pages/service/Services';
import Manager from './pages/admin/Manager';
import AboutUs from './pages/about/AboutUs'; // Add this line
import StaffManagement from './pages/admin/StaffManagement';
import NotFound from './pages/NotFound';
import BookingPage from './pages/admin/BookingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Header and Footer */}
        <Route path='/manager' element={<Manager />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        
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
                  <Route path="/customer-profile" element={<CustomerPage />} />
                  <Route path="/staff-profile" element={<StaffPage />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/booking-detail" element={<BookingPage/>}/>
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        }>
          <Route index element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/care-guide" element={<CareGuide />} />
          <Route path="/water-qua lity" element={<WaterQuality />} />
          <Route path="/fish-types" element={<FishTypes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/customer-profile" element={<CustomerPage />} />
          <Route path="/staff-profile" element={<StaffPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/booking-detail" element={<BookingPage/>}/>
        </Route>

        {/* NotFound route without Header and Footer */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;