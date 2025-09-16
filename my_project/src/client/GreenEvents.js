import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useDashboard } from '../admin/Dashboard'; // Import useDashboard
import { useLocation } from 'react-router-dom'; // Import useLocation
import './GreenEvents.css';

const GreenEvents = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation(); // Get current location
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Call useDashboard unconditionally
  const dashboardContext = useDashboard();
  // Safely destructure userData, providing a default empty object if dashboardContext is null
  const { userData } = dashboardContext || {};
  console.log('GreenEvents: User data received:', userData);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to add an event.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert('Event added successfully!');
        setNewEvent({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          image: '',
        });
        setShowAddEventForm(false); // Hide form after submission
        fetchEvents(); // Refresh event list
      } else {
        const errorData = await response.json();
        alert(`Failed to add event: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Error adding event:', err);
      alert('An error occurred while adding the event.');
    }
  };

  if (loading) {
    return <div className={`green-events-page ${theme === 'dark' ? 'dark' : ''}`}>Loading events...</div>;
  }

  if (error) {
    return <div className={`green-events-page ${theme === 'dark' ? 'dark' : ''}`}>Error: {error}</div>;
  }

  return (
    <div className={`green-events-page ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="events-hero">
        <h1>Discover Green Events Near You</h1>
        <p>Join our community in making a positive impact on the environment.</p>
        {userData?.isAdmin && (
          <button className="add-event-btn" onClick={() => setShowAddEventForm(!showAddEventForm)}>
            {showAddEventForm ? 'Cancel Add Event' : 'Add New Event'}
          </button>
        )}
      </div>

      {showAddEventForm && userData?.isAdmin && (
        <div className="add-event-form-container">
          <h2>Add New Green Event</h2>
          <form onSubmit={handleSubmit} className="add-event-form">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Event Title" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} placeholder="Event Date" required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} placeholder="Event Time" required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} placeholder="Event Location" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Event Description" required></textarea>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" name="image" value={newEvent.image} onChange={handleInputChange} placeholder="Image URL (optional)" />
            </div>
            <button type="submit" className="btn-primary">Submit Event</button>
          </form>
        </div>
      )}

      <div className="events-list-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="event-info">
                <h2>{event.title}</h2>
                <p className="event-date-time">🗓️ {event.date} | 🕒 {event.time}</p>
                <p className="event-location">📍 {event.location}</p>
                <p className="event-description">{event.description}</p>
                <button className="event-learn-more">Learn More</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events-message">No green events available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default GreenEvents;
