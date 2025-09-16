import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './GreenEventsPreview.css';

const eventsData = [
  {
    id: 1,
    title: 'Community Garden Cleanup',
    date: 'September 15, 2025',
    time: '10:00 AM - 1:00 PM',
    location: 'Central Park Community Garden',
    description: 'Join us to help maintain our beautiful community garden. All ages welcome!',
    image: 'https://via.placeholder.com/400x250/a8e6cf/ffffff?text=Garden+Cleanup',
  },
  {
    id: 2,
    title: 'Eco-Friendly Workshop',
    date: 'September 22, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Online (Zoom)',
    description: 'Learn practical tips for reducing your carbon footprint at home.',
    image: 'https://via.placeholder.com/400x250/d4a8e6/ffffff?text=Eco+Workshop',
  },
  {
    id: 3,
    title: 'Local Beach Cleanup',
    date: 'October 5, 2025',
    time: '9:00 AM - 12:00 PM',
    location: 'Oceanfront Beach',
    description: 'Help us keep our beaches clean and protect marine life.',
    image: 'https://via.placeholder.com/400x250/a8c6e6/ffffff?text=Beach+Cleanup',
  },
];

const GreenEventsPreview = () => {
  const { theme } = useTheme();
  return (
    <div className={`green-events-preview ${theme}`}>
      <h2 className="text-center mb-5 section-title-3">Upcoming Green Events</h2>
      <div className="events-list-container">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card">
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-info">
              <h2>{event.title}</h2>
              <p className="event-date-time">🗓️ {event.date} | 🕒 {event.time}</p>
              <p className="event-location">📍 {event.location}</p>
              <p className="event-description">{event.description}</p>
              <button className="event-learn-more">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GreenEventsPreview;
