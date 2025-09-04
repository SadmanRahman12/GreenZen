import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    avatar: '',
    settings: {
      notifications: {
        email: true,
        push: true,
      },
      theme: 'light',
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { theme, toggleTheme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/user/settings', {
          headers: {
            'x-auth-token': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          if (data.settings && data.settings.theme) {
            setTheme(data.settings.theme);
          }
        } else {
          console.error('Failed to fetch user settings');
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserData();
  }, [setTheme]);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setUserData(prevData => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        theme: newTheme,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prevData => ({
        ...prevData,
        settings: {
          ...prevData.settings,
          [parent]: {
            ...prevData.settings[parent],
            [child]: type === 'checkbox' ? checked : value,
          },
        },
      }));
    } else {
      setUserData(prevData => ({ ...prevData, [name]: value }));
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
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
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
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h3>Profile Settings</h3>
            <div className={`form-group ${userData.username ? 'has-value' : ''}`}>
              <input type="text" name="username" value={userData.username} onChange={handleInputChange} placeholder=" " />
              <label>Username</label>
            </div>
            <div className={`form-group ${userData.avatar ? 'has-value' : ''}`}>
              <input type="text" name="avatar" value={userData.avatar} onChange={handleInputChange} placeholder=" " />
              <label>Avatar URL</label>
            </div>
          </div>
        );
      case 'account':
        return (
          <div>
            <h3>Account Settings</h3>
            <div className={`form-group ${userData.email ? 'has-value' : ''}`}>
              <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder=" " />
              <label>Email</label>
            </div>
            <hr />
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
                <input type="checkbox" name="settings.notifications.email" checked={userData.settings.notifications.email} onChange={handleInputChange} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="form-group-toggle">
              <label>Push Notifications</label>
              <label className="switch">
                <input type="checkbox" name="settings.notifications.push" checked={userData.settings.notifications.push} onChange={handleInputChange} />
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
                <input type="checkbox" name="settings.theme" checked={theme === 'dark'} onChange={handleThemeChange} />
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
    <div className="settings-page">
      <div className="row">
        <div className="col-sm-3">
          <ul className="settings-nav">
            <li className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</li>
            <li className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account</li>
            <li className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</li>
            <li className={`settings-nav-item ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</li>
          </ul>
        </div>
        <div className="col-sm-9">
          <div className="settings-content">
            {renderContent()}
            <div className="settings-actions">
              <button onClick={handleSaveChanges} className="btn-primary">Save Changes</button>
              <button onClick={handleLogout} className="btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;