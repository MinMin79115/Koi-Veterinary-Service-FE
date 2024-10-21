import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
<<<<<<< HEAD
=======
  CustomerServiceOutlined,
  CalendarOutlined 
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import StaffManagement from './StaffManagement';
import Dashboard from './Dashboard';
import AdminProfile from './AdminPage';
<<<<<<< HEAD
const { Header, Content, Sider } = Layout;
import { useNavigate } from 'react-router-dom';
=======
import FAQManagement from './FAQ';
import ServiceManagement from './ServiceManagement';
import SlotManagement from './SlotManagement';
const { Content, Sider } = Layout;
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlider';

>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD

=======
  const dispatch = useDispatch();
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    getItem('Dasboard', 'dashboard', <BarChartOutlined />),
    getItem('Manage Staff', 'staff', <PieChartOutlined />),
    getItem('Manage FAQ', 'faq', <DesktopOutlined />),
<<<<<<< HEAD
=======
    getItem('Manage Service', 'service', <CustomerServiceOutlined />),
    getItem('Manage Slot', 'slot', <CalendarOutlined />),
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD
        return <div>FAQ Management Content</div>;
      case 'profile':
        return <AdminProfile />;
      case 'logout':
=======
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
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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
<<<<<<< HEAD
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey === 'dashboard' ? 'Dashboard' : selectedKey === 'staff' ? 'Staff Management' : selectedKey === 'faq' ? 'FAQ Management' : 'User Profile'}</Breadcrumb.Item>
=======
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey === 'dashboard' ? 'Dashboard' : selectedKey === 'staff' ? 'Staff Management' : selectedKey === 'faq' ? 'FAQ Management' : selectedKey === 'service' ? 'Service Management' : selectedKey === 'slot' ? 'Slot Management' : 'User Profile'}</Breadcrumb.Item>
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
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