import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: 'User',
    email: 'user@example.com',
    memberSince: '2023-01-15',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/user/settings', { // Reusing the settings endpoint for now
          headers: {
            'x-auth-token': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(prevData => ({ ...prevData, ...data }));
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    { icon: 'fas fa-leaf', value: '1,250', label: 'Carbon Saved (kg)' },
    { icon: 'fas fa-check-circle', value: '82', label: 'Habits Formed' },
    { icon: 'fas fa-star', value: '4,500', label: 'Community Points' },
  ];

  const achievements = [
    { icon: 'fas fa-trophy', label: 'Eco-Warrior' },
    { icon: 'fas fa-seedling', label: 'Green Thumb' },
    { icon: 'fas fa-recycle', label: 'Recycling Guru' },
    { icon: 'fas fa-lightbulb', label: 'Energy Saver' },
    { icon: 'fas fa-users', label: 'Community Leader' },
  ];

  const recentActivity = [
    { action: 'Completed a new habit', date: '2024-07-20' },
    { action: 'Joined a community event', date: '2024-07-18' },
    { action: 'Shared a new tip', date: '2024-07-15' },
    { action: 'Earned a new achievement', date: '2024-07-12' },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-container">
          <img src={`https://i.pravatar.cc/150?u=${userData.email}`} alt="User Avatar" className="profile-avatar" />
          <button className="camera-icon"><i className="fas fa-camera"></i></button>
        </div>
        <div className="profile-header-info">
          <h2>{userData.username}</h2>
          <p>{userData.email}</p>
          <Link to="/dashboard/settings" className="edit-profile-btn">
            <i className="fas fa-pencil-alt"></i> Edit Profile
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card stats-card">
          <h3><i className="fas fa-chart-bar"></i> Your Stats</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <i className={stat.icon + ' stat-icon'}></i>
                <p>{stat.value}</p>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card achievements-card">
          <h3><i className="fas fa-award"></i> Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <i className={achievement.icon + ' achievement-icon'}></i>
                <p>{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card activity-card">
          <h3><i className="fas fa-history"></i> Recent Activity</h3>
          <ul>
            {recentActivity.map((activity, index) => (
              <li key={index}>
                <span>{activity.action}</span>
                <span className="activity-date">{activity.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
