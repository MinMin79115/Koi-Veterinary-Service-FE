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
import CustomerPage from './pages/customer/CustomerPage';
import StaffPage from './pages/admin/StaffProfile';
// import VeterianPage from '.pages/admin/VeterianProfile'
import Booking from './pages/service/Booking';
import Services from './pages/service/Services';
import Manager from './pages/admin/Manager';
import AboutUs from './pages/about/AboutUs'; // Add this line
import StaffManagement from './pages/admin/StaffManagement';
import NotFound from './pages/NotFound';
import BookingManagement from './pages/booking/BookingManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import BookingDetail from './pages/booking/BookingDetail';
function App() {
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
    if (user && user?.role === 'CUSTOMER') {
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

  const ProtectedRouteVeterian = ({ children }) => {
    const user = useSelector((state) => state.user);
    if (user && user?.role === 'VETERIAN') {
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
        {/* <Route path="/booking-management" element={<ProtectedRouteStaff><BookingManagement/></ProtectedRouteStaff>}/> */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
                  <Route path="/customer-profile" element={<ProtectedRouteCustomer><CustomerPage /></ProtectedRouteCustomer>} />
                  <Route path="/staff-profile" element={<ProtectedRouteStaff><StaffPage /></ProtectedRouteStaff>} />
                  {/* <Route path="/veterian-profile" element={<ProtectedRouteVeterian><VeterianPage/></ProtectedRouteVeterian>}/> */}
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking-detail" element={<BookingDetail />} />
                  <Route path="/booking-management" element={<BookingManagement />} />
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
          <Route path="/customer-profile" element={<CustomerPage />} />
          <Route path="/staff-profile" element={<StaffPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/booking-management" element={<BookingManagement />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* NotFound route without Header and Footer */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;