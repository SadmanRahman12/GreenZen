import React from 'react';
import { Outlet } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file

const Dashboard = ({ name }) => {

  return (
    <div className="dashboard-layout">
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