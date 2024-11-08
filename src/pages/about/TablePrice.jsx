import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TablePrice.css';

const TablePrice = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const priceData = [
    {
      type: 'Online Consulting',
      price: '50.000',
      features: [
        'Online Consultation',
        'Video Call Support',
        'Digital Prescription',
        'Follow-up Chat',
        '24/7 Emergency Support'
      ],
      location: 'online'
    },
    {
      type: 'Koi Fish Disease Treatment',
      price: '150.000',
      features: [
        'Professional Examination',
        'Disease Diagnosis',
        'Treatment Plan',
        'Medication Prescription',
        'Follow-up Care'
      ],
      location: 'at_center'
    },
    {
      type: 'Evaluate Koi Fish Pond Quality',
      price: '200.000',
      features: [
        'Water Quality Testing',
        'Filtration System Check',
        'pH Level Analysis',
        'Environmental Assessment',
        'Improvement Recommendations'
      ],
      location: 'at_center'
    }
  ];

  useEffect(() => {
    const allServices = priceData.flatMap(service => {
      if (service.location === 'online') {
        return [service];
      }
      
      const centerService = {
        ...service,
        type: `${service.type} (At Center)`
      };
      
      const homeService = {
        ...service,
        type: `${service.type} (At Home)`,
        price: service.price,
        features: [
          ...service.features,
          'Home Visit Service',
          'Convenient Location',
          'Additional fee based on distance'
        ],
        location: 'at_home',
        hasDistanceNote: true
      };

      return [centerService, homeService];
    });

    setServices(allServices);
    setLoading(false);
  }, []);

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
            // disableOnInteraction: false,
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
                  <h3 className="service-type">{service.type}</h3>
                  <div className="price-amount">
                    <span className="currency">VND </span>
                    {service.price}
                  </div>
                  {service.hasDistanceNote && (
                    <div className="distance-note">
                      <InfoCircleOutlined />
                      <span>Additional fee: +10% per kilometer from center</span>
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
