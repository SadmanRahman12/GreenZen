import React, { useState, useEffect } from 'react';
import './DashboardEvents.css';

const DashboardEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
        setNewEvent({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          image: '',
        });
        alert('Event created successfully!');
      } else {
        alert('Failed to create event.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event.');
    }
  };

  return (
    <div className="dashboard-events">
      <h2>Green Events</h2>

      <div className="create-event-form">
        <h3>Create a New Event</h3>
        <form onSubmit={handleCreateEvent}>
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            placeholder="Event Title"
            required
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            required
          />
          <input
            type="time"
            name="time"
            value={newEvent.time}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
          />
          <textarea
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          ></textarea>
          <input
            type="text"
            name="image"
            value={newEvent.image}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
          <button type="submit">Create Event</button>
        </form>
      </div>

      <div className="events-list">
        <h3>Upcoming Events</h3>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-item">
              <h4>{event.title}</h4>
              <p>{event.date} at {event.time}</p>
              <p>{event.location}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardEvents;
