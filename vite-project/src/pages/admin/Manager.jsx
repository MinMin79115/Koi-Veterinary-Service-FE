import React, { useState } from 'react';
import {
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  CalendarOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import StaffManagement from './StaffManagement';
import Dashboard from './Dashboard';
import AdminProfile from './AdminPage';
import ServiceManagement from './ServiceManagement';
import SlotManagement from './SlotManagement';
import TablePriceManagement from './TablePriceManagement';
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
    getItem('Manage Service', 'service', <CustomerServiceOutlined />),
    getItem('Manage Slot', 'slot', <CalendarOutlined />),
    getItem('Manage Table Price', 'tablePrice', <MoneyCollectOutlined />),
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
      case 'service':
        return <ServiceManagement />;
      case 'slot':
        return <SlotManagement />;
      case 'tablePrice':
        return <TablePriceManagement />;
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
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100%',
          position: 'fixed',
          left: 0,
          zIndex: 1
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey === 'dashboard' ? 'Dashboard' : selectedKey === 'staff' ? 'Staff Management' : selectedKey === 'service' ? 'Service Management' : selectedKey === 'slot' ? 'Slot Management' : 'User Profile'}</Breadcrumb.Item>
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