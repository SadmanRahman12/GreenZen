import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './DashboardEducation.css';

const DashboardEducation = () => {
  const { theme } = useContext(ThemeContext);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/publications');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPublications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return <div className={`dashboard-education-container ${theme === 'dark' ? 'dark' : ''}`}>Loading education content...</div>;
  }

  if (error) {
    return <div className={`dashboard-education-container ${theme === 'dark' ? 'dark' : ''}`}>Error: {error}</div>;
  }

  return (
    <div className={`dashboard-education-container ${theme === 'dark' ? 'dark' : ''}`}>
      <h2 className="education-header">Educational Resources</h2>
      {publications.length > 0 ? (
        <div className="publications-grid">
          {publications.map((publication) => (
            <div key={publication._id} className="publication-card">
              <img src={publication.image} alt={publication.title} className="publication-image" />
              <div className="publication-content">
                <h3 className="publication-title">{publication.title}</h3>
                <p className="publication-author">By {publication.author}</p>
                <p className="publication-snippet">{publication.content.substring(0, 150)}...</p>
                <a href={`/publications/${publication.slug}`} className="read-more-btn">Read More</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-publications-message">No educational resources available at the moment.</p>
      )}
    </div>
  );
};

export default DashboardEducation;