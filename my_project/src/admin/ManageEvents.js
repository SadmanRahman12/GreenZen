import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };

    try {
      if (editingEventId) {
        await axios.put(
          `http://localhost:5000/api/events/${editingEventId}`,
          formData,
          config
        );
        alert('Event updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/events', formData, config);
        alert('Event added successfully!');
      }
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: '',
      });
      setEditingEventId(null);
      fetchEvents();
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Error saving event.');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      date: event.date.split('T')[0], // Format date for input type="date"
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image,
    });
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, config);
        alert('Event deleted successfully!');
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Error deleting event.');
      }
    }
  };

  return (
    <div>
      <h3>{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
          />
        </div>
        <div className="admin-form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="admin-form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="admin-button">
          {editingEventId ? 'Update Event' : 'Add Event'}
        </button>
        {editingEventId && (
          <button
            type="button"
            className="admin-button"
            onClick={() => {
              setEditingEventId(null);
              setFormData({
                title: '',
                date: '',
                time: '',
                location: '',
                description: '',
                image: '',
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 style={{ marginTop: '30px' }}>Existing Events</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td className="admin-action-buttons">
                <button onClick={() => handleEdit(event)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(event._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEvents;
