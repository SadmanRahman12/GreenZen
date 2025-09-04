import React from 'react';
import './DashboardForum.css';

const DashboardForum = () => {
  return (
    <div className="dashboard-forum">
      <h2>Admin - Community Forum</h2>
      <p>Welcome to the forum management page. Here you can moderate discussions.</p>
      
      {/* Placeholder for forum management tools */}
      <div className="forum-management-tools">
        <div className="tool-card">
          <h3>Reported Posts</h3>
          <p>3 new reports</p>
          <button className="btn btn-primary">Review Reports</button>
        </div>
        <div className="tool-card">
          <h3>Manage Categories</h3>
          <p>5 categories active</p>
          <button className="btn btn-primary">Edit Categories</button>
        </div>
        <div className="tool-card">
          <h3>User Management</h3>
          <p>1,200 active users</p>
          <button className="btn btn-primary">Manage Users</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardForum;
