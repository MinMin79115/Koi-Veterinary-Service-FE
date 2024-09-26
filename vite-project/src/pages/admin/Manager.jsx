import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import StaffManagement from './StaffManagement';
import Dashboard from './Dashboard';
import AdminProfile from './AdminPage';
const { Header, Content, Sider } = Layout;
import { useNavigate } from 'react-router-dom';
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Manager = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    getItem('Dasboard', 'dashboard', <BarChartOutlined />),
    getItem('Manage Staff', 'staff', <PieChartOutlined />),
    getItem('Manage FAQ', 'faq', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
      getItem('Profile', 'profile'),
      getItem('Logout', 'logout'),
    ]),

  ];

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'staff':
        return <StaffManagement />;
      case 'faq':
        return <div>FAQ Management Content</div>;
      case 'profile':
        return <AdminProfile />;
      case 'logout':
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
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Manager</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedKey === 'dashboard' ? 'Dashboard' : selectedKey === 'staff' ? 'Staff Management' : selectedKey === 'faq' ? 'FAQ Management' : 'User Profile'}</Breadcrumb.Item>
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