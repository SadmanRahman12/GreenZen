import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AdminDashboard.css';
import ManageEvents from './ManageEvents';
import ManagePublications from './ManagePublications';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'publications', 'users'

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate('/'); // Redirect non-admin users
    }
  }, [user, loading, navigate]);

  if (loading || !user || !user.isAdmin) {
    return <div>Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Manage Events</li>
            <li className={activeTab === 'publications' ? 'active' : ''} onClick={() => setActiveTab('publications')}>Manage Publications</li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Manage Users</li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {activeTab === 'events' && (
          <section>
            <h3>Manage Events</h3>
            <ManageEvents />
          </section>
        )}
        {activeTab === 'publications' && (
          <section>
            <h3>Manage Publications</h3>
            <ManagePublications />
          </section>
        )}
        {activeTab === 'users' && (
          <section>
            <h3>Manage Users</h3>
            <ManageUsers />
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
