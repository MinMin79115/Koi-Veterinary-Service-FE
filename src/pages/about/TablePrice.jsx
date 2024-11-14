import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { useSelector } from 'react-redux';
import api from '../../config/axios';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TablePrice.css';

const TablePrice = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await api.get('services/type',);
      
      // Transform the API data into the required format
      const transformedServices = response.data.reduce((acc, service) => {
        const serviceType = {
          type: service.service_type,
          price: service.price.toLocaleString('vi-VN'),
          features: getFeaturesByType(service.service_type),
          location: service.service_type.toLowerCase().replace(' ', '_'),
          hasDistanceNote: service.service_type === 'At_Home'
        };
        
        acc.push(serviceType);
        return acc;
      }, []);

      setServices(transformedServices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error.response?.data);
      setLoading(false);
    }
  };

  const getFeaturesByType = (type) => {
    switch (type) {
      case 'Online':
        return [
          'Online Consultation',
          'Video Call Support',
          'Digital Prescription',
          'Follow-up Chat',
          '24/7 Emergency Support'
        ];
      case 'At_Center':
        return [
          'Professional Examination',
          'Disease Diagnosis',
          'Treatment Plan',
          'Medication Prescription',
          'Follow-up Care'
        ];
      case 'At_Home':
        return [
          'Professional Examination',
          'Disease Diagnosis',
          'Treatment Plan',
          'Medication Prescription',
          'Follow-up Care',
          'Home Visit Service',
          'Convenient Location'
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="price-table-container">
      <div className="price-header">
        <h2>Our Service Pricing</h2>
        <p>Choose the service type that best suits your needs</p>
      </div>

      <div className="swiper-container">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 3000,
          }}
          spaceBetween={30}
          slidesPerView={2}
          navigation={true}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            }
          }}
          className="price-swiper"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="price-card">
                <div className="card-header">
                  <h3 className="service-type">{service.type.replace('_', ' ')}</h3>
                  <div className="price-amount">
                    <span className="currency">VND </span>
                    {service.price}
                  </div>
                  {service.hasDistanceNote && (
                    <div className="distance-note">
                      <InfoCircleOutlined />
                      <span>Additional fee: +50,000 VNĐ for moving.</span>
                    </div>
                  )}
                </div>
                
                <div className="features-grid">
                  {service.features.map((feature, idx) => (
                    <div className="feature-item" key={idx}>
                      <CheckCircleOutlined style={{ color: '#40c057' }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="card-footer">
                  <Link to="/booking#booking">
                    <button className="book-button">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TablePrice;
