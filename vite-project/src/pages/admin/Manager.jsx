import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import StaffManagement from './StaffManagement';
import Dashboard from './Dashboard';
import AdminProfile from './AdminPage';
import FAQManagement from './FAQ';
import ServiceManagement from './ServiceManagement';
import SlotManagement from './SlotManagement';
const { Content, Sider } = Layout;
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlider';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}


const Manager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    getItem('Dasboard', 'dashboard', <BarChartOutlined />),
    getItem('Manage Staff', 'staff', <PieChartOutlined />),
    getItem('Manage FAQ', 'faq', <DesktopOutlined />),
    getItem('Manage Service', 'service', <CustomerServiceOutlined />),
    getItem('Manage Slot', 'slot', <CalendarOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Profile', 'profile'),
      getItem('Logout', 'logout'),
    ]),

  ];

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'staff':
        return <StaffManagement />;
      case 'faq':
        return <FAQManagement />;
      case 'service':
        return <ServiceManagement />;
      case 'slot':
        return <SlotManagement />;
      case 'profile':
        return <AdminProfile />;
      case 'logout':
        dispatch(logout())
        sessionStorage.clear()
        return navigate('/login');
      default:
        return <div>Select an option</div>;
    }
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey === 'dashboard' ? 'Dashboard' : selectedKey === 'staff' ? 'Staff Management' : selectedKey === 'faq' ? 'FAQ Management' : selectedKey === 'service' ? 'Service Management' : selectedKey === 'slot' ? 'Slot Management' : 'User Profile'}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Manager;