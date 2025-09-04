import React from 'react';
import './GreenEvents.css';

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
  {
    id: 4,
    title: 'Sustainable Living Fair',
    date: 'October 19, 2025',
    time: '11:00 AM - 5:00 PM',
    location: 'City Convention Center',
    description: 'Explore local green businesses, workshops, and speakers.',
    image: 'https://via.placeholder.com/400x250/e6cfa8/ffffff?text=Sustainability+Fair',
  },
  {
    id: 5,
    title: 'Urban Farming Initiative',
    date: 'November 1, 2025',
    time: '9:00 AM - 3:00 PM',
    location: 'Downtown Rooftop Farm',
    description: 'Hands-on experience in urban farming techniques and sustainable food production.',
    image: 'https://via.placeholder.com/400x250/b3e0b3/ffffff?text=Urban+Farming',
  },
  {
    id: 6,
    title: 'Recycling Drive & E-Waste Collection',
    date: 'November 10, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Community Recycling Center',
    description: 'Bring your recyclables and old electronics for responsible disposal.',
    image: 'https://via.placeholder.com/400x250/c2e0c2/ffffff?text=Recycling+Drive',
  },
  {
    id: 7,
    title: 'Green Energy Solutions Webinar',
    date: 'November 25, 2025',
    time: '6:00 PM - 7:30 PM',
    location: 'Online (Google Meet)',
    description: 'Discover the latest in renewable energy and how to implement it at home.',
    image: 'https://via.placeholder.com/400x250/d1e0d1/ffffff?text=Green+Energy',
  },
  {
    id: 8,
    title: 'Winter Tree Planting Day',
    date: 'December 7, 2025',
    time: '9:00 AM - 1:00 PM',
    location: 'Local Nature Reserve',
    description: 'Help us plant new trees to restore local ecosystems and combat climate change.',
    image: 'https://via.placeholder.com/400x250/e0e0e0/ffffff?text=Tree+Planting',
  },
];

const GreenEvents = () => {
  return (
    <div className="green-events-page">
      <div className="events-hero">
        <h1>Discover Green Events Near You</h1>
        <p>Join our community in making a positive impact on the environment.</p>
      </div>

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

export default GreenEvents;