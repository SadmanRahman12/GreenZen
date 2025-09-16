import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../admin/Dashboard';
import './Settings.css';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { userData, fetchUserData } = useDashboard(); // Get user data from dashboard context
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [localSettings, setLocalSettings] = useState({
    notifications: {
      email: true,
      push: true,
    },
    theme: 'light',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { theme, toggleTheme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Update local settings when userData from context changes
  useEffect(() => {
    if (userData) {
      setCurrentName(userData.name || '');
      setCurrentEmail(userData.email || '');
      if (userData.settings) {
        setLocalSettings(userData.settings);
        // No need to call setTheme here, ThemeWrapper handles it based on localSettings.theme
      }
    }
  }, [userData]); // Removed setTheme from dependency array as it's not directly used here

  const handleThemeChange = () => {
    toggleTheme(); // Use the toggleTheme function from context
    setLocalSettings(prevSettings => ({
      ...prevSettings,
      theme: theme === 'light' ? 'dark' : 'light', // Update local settings based on *current* theme after toggle
    }));
  };

  const handleSettingsInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name') {
      setCurrentName(value);
    } else if (name === 'email') {
      setCurrentEmail(value);
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLocalSettings(prevSettings => ({
        ...prevSettings,
        [parent]: {
          ...prevSettings[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setLocalSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          name: currentName, // Send updated name
          email: currentEmail, // Send updated email
          settings: localSettings, // Send updated local settings
        }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
        fetchUserData(); // Refresh user data in dashboard context
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings.');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to change password: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    if (!userData) {
      return <div>Loading user data...</div>;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h3>Profile Settings</h3>
            <div className={`form-group ${currentName ? 'has-value' : ''}`}>
              <input type="text" name="name" value={currentName} onChange={handleSettingsInputChange} placeholder=" " />
              <label>Name</label>
            </div>
            <div className={`form-group ${currentEmail ? 'has-value' : ''}`}>
              <input type="email" name="email" value={currentEmail} onChange={handleSettingsInputChange} placeholder=" " />
              <label>Email</label>
            </div>
          </div>
        );
      case 'account':
        return (
          <div>
            <h3>Account Settings</h3>
            <h4>Change Password</h4>
            <div className={`form-group ${passwordData.currentPassword ? 'has-value' : ''}`}>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder=" " />
              <label>Current Password</label>
            </div>
            <div className={`form-group ${passwordData.newPassword ? 'has-value' : ''}`}>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder=" " />
              <label>New Password</label>
            </div>
            <div className={`form-group ${passwordData.confirmPassword ? 'has-value' : ''}`}>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder=" " />
              <label>Confirm New Password</label>
            </div>
            <button onClick={handleChangePassword} className="btn-primary">Change Password</button>
          </div>
        );
      case 'notifications':
        return (
          <div>
            <h3>Notification Settings</h3>
            <div className="form-group-toggle">
              <label>Email Notifications</label>
              <label className="switch">
                <input type="checkbox" name="notifications.email" checked={localSettings.notifications.email} onChange={handleSettingsInputChange} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="form-group-toggle">
              <label>Push Notifications</label>
              <label className="switch">
                <input type="checkbox" name="notifications.push" checked={localSettings.notifications.push} onChange={handleSettingsInputChange} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div>
            <h3>Theme Settings</h3>
            <div className="form-group-toggle">
              <label>Dark Mode</label>
              <label className="switch">
                <input type="checkbox" name="theme" checked={theme === 'dark'} onChange={handleThemeChange} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`settings-page ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="settings-container">
        <div className="settings-nav-panel">
          <ul className="settings-nav">
            <li className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</li>
            <li className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account</li>
            <li className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</li>
            <li className={`settings-nav-item ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</li>
          </ul>
        </div>
        <div className="settings-content-panel">
          <div className="settings-content-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
          </div>
          <div className="settings-content-body">
            {renderContent()}
          </div>
          <div className="settings-actions">
            <button onClick={handleSaveChanges} className="btn-primary">Save Changes</button>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;