import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/user/all', config);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    const confirmMessage = currentStatus
      ? 'Are you sure you want to revoke admin status from this user?'
      : 'Are you sure you want to grant admin status to this user?';

    if (window.confirm(confirmMessage)) {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        await axios.put(`http://localhost:5000/api/user/toggle-admin/${id}`, {}, config);
        alert('User admin status updated!');
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error('Error toggling admin status:', err);
        alert('Error updating admin status.');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        await axios.delete(`http://localhost:5000/api/user/${id}`, config);
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user.');
      }
    }
  };

  return (
    <div>
      <h3>Manage Users</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td className="admin-action-buttons">
                <button
                  onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                  className="toggle-btn"
                >
                  {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="delete-btn"
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
