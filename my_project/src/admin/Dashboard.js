import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'x-auth-token': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        console.log('Dashboard: User data fetched successfully:', data);
      } else {
        console.error('Dashboard: Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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