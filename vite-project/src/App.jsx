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
import CustomerPage from './pages/CustomerPage';
import StaffPage from './pages/admin/StaffProfile';
import Booking from './pages/service/Booking';
import Services from './pages/service/Services';
import Manager from './pages/admin/Manager';
import AboutUs from './pages/about/AboutUs'; // Add this line
import StaffManagement from './pages/admin/StaffManagement';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Manager route without Header and Footer */}
        <Route path='/manager' element={<Manager />} />
        <Route path='/*' element={<NotFound />} />
        <Route path="/login" element={
          <>
            <Login />
          </>
        } />
        <Route path="/register" element={
          <>
            <Register />
          </>
        } />
        <Route path="/staff-management" element={
          <>
            <StaffManagement />
          </>
        } />
        {/* All other routes with Header and Footer */}
        <Route path="/" element={
          <div className="App">
            <div className="page-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={
                    <>
                      <Home />
                    </>
                  } />
                  <Route path="/services" element={
                    <>
                      <Services />
                    </>
                  } />
                  <Route path="/care-guide" element={
                    <>
                      <CareGuide />
                    </>
                  } />
                  <Route path="/water-quality" element={
                    <>
                      <WaterQuality />
                    </>
                  } />
                  <Route path="/fish-types" element={
                    <>
                      <FishTypes />
                    </>
                  } />
                  <Route path="/contact" element={
                    <>
                      <Contact />
                    </>
                  } />
                  <Route path="/customer-profile" element={
                    <>
                      <CustomerPage />
                    </>
                  } />
                  <Route path="/staff-profile" element={
                    <>
                      <StaffPage />
                    </>
                  } />
                  <Route path="/booking" element={
                    <>
                      <Booking />
                    </>
                  } />
                  <Route path="/about" element={
                    <>
                      <AboutUs />
                    </>
                  } />

                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;