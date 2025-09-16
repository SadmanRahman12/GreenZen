import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = ({ name }) => {

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
          <h1>Welcome, {userData ? userData.username : 'User'}!</h1>
          <p>This is your dashboard.</p>
        </div>
        <Outlet context={{ userData, fetchUserData }} />
      </div>
    </div>
  );
};

export function useDashboard() {
    return useOutletContext();
}

export default Dashboard;