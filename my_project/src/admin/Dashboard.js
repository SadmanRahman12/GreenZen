import React from 'react';
import { Outlet } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = ({ name }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Campaigns', path: '/dashboard/campaigns' },
    { label: 'Challenges', path: '/dashboard/challenges' },
    { label: 'Leaderboard', path: '/dashboard/leaderboard' },
  ];

  return (
    <div className="dashboard-layout">
      <Nav variant="tabs" className="dashboard-nav mb-4" activeKey={location.pathname}>
        {tabs.map(tab => (
          <Nav.Item key={tab.path}>
            <Nav.Link
              eventKey={tab.path}
              onClick={() => navigate(tab.path)}
              active={location.pathname === tab.path || (tab.path === '/dashboard' && location.pathname === '/dashboard')}
            >
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {name}!</h1>
          <p>This is your dashboard.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;