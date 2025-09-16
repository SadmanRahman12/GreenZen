import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../admin/Dashboard';
import { ThemeContext } from '../context/ThemeContext';
import './Profile.css';

const Profile = () => {
  const { userData } = useDashboard();
  const { theme } = useContext(ThemeContext);

  if (!userData) {
    return <div className={`profile-page ${theme === 'dark' ? 'dark' : ''}`}>Loading...</div>;
  }

  // Destructure user data for easier access, providing defaults
  const { 
    name = 'Guest',
    email = 'N/A',
    memberSince = 'N/A',
    carbonSaved = 0,
    habitsFormed = 0,
    points = 0,
    achievements = [],
    recentActivity = [],
  } = userData;

  return (
    <div className={`profile-page ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="profile-header-card">
        <div className="profile-avatar-container">
          <img src={`https://i.pravatar.cc/150?u=${email}`} alt="User Avatar" className="profile-avatar" />
          <button className="camera-icon"><i className="fas fa-camera"></i></button>
        </div>
        <div className="profile-header-info">
          <h2>{name}</h2>
          <p>{email}</p>
          <Link to="/dashboard/settings" className="edit-profile-btn">
            <i className="fas fa-pencil-alt"></i> Edit Profile
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card stats-card">
          <h3><i className="fas fa-chart-bar"></i> Your Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
                <i className='fas fa-leaf stat-icon'></i>
                <p>{carbonSaved}</p>
                <span>Carbon Saved (kg)</span>
            </div>
            <div className="stat-item">
                <i className='fas fa-check-circle stat-icon'></i>
                <p>{habitsFormed}</p>
                <span>Habits Formed</span>
            </div>
            <div className="stat-item">
                <i className='fas fa-star stat-icon'></i>
                <p>{points}</p>
                <span>Community Points</span>
            </div>
          </div>
        </div>

        <div className="profile-card achievements-card">
          <h3><i className="fas fa-award"></i> Achievements</h3>
          <div className="achievements-grid">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <i className={achievement.icon + ' achievement-icon'}></i>
                  <p>{achievement.label}</p>
                </div>
              ))
            ) : (
              <p className="no-achievements-message">No achievements yet. Keep up the great work!</p>
            )}
          </div>
        </div>

        <div className="profile-card activity-card">
          <h3><i className="fas fa-history"></i> Recent Activity</h3>
          <ul>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <li key={index}>
                  <span>{activity.action}</span>
                  <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </li>
              ))
            ) : (
              <p className="no-activity-message">No recent activity.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;