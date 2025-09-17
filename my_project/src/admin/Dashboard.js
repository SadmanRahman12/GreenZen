import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Dashboard = ({ name }) => {
  const { userData, fetchUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', label: 'Home' },
    { path: '/dashboard/habit-tracker', label: 'Habit Tracker' },
    { path: '/dashboard/leaderboard', label: 'Leaderboard' },
    { path: '/dashboard/education', label: 'Education' },
    { path: '/dashboard/impact', label: 'Impact' },
    { path: '/dashboard/profile', label: 'Profile' },
    { path: '/dashboard/settings', label: 'Settings' },
    { path: '/dashboard/events', label: 'Green Events' },
    { path: '/dashboard/carbon-calculator', label: 'Carbon Calculator' },
    { path: '/dashboard/forum', label: 'Community Forum' },
  ];

  return (
    <div className="dashboard-layout">
      
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