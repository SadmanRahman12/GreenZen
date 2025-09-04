import React from 'react';
import { Link } from 'react-router-dom';
import publicationData from './publicationData';
import './Publication.css';

import publication1 from '../images/publication1.jpg';
import publication2 from '../images/publication2.jpg';
import publication3 from '../images/publication3.jpg';
import publication4 from '../images/publication4.jpg';
import publication5 from '../images/publication5.jpg';
import publication6 from '../images/publication6.jpg';
import publication7 from '../images/publication7.jpg';
import publication8 from '../images/publication8.jpg';

const images = {
  'publication1.jpg': publication1,
  'publication2.jpg': publication2,
  'publication3.jpg': publication3,
  'publication4.jpg': publication4,
  'publication5.jpg': publication5,
  'publication6.jpg': publication6,
  'publication7.jpg': publication7,
  'publication8.jpg': publication8,
};

const Publication = () => {
  const featuredPublication = publicationData.popular[0];
  const otherPublications = [...publicationData.standard, ...publicationData.latest, ...publicationData.new, ...publicationData.popular.slice(1)];

  return (
    <div className="publication-container">
      <header className="publication-header">
        <h1>Explore Our Publications</h1>
        <p>In-depth articles and research on environmental sustainability.</p>
      </header>

      <div className="featured-publication">
        <img src={images[featuredPublication.image]} alt={featuredPublication.title} />
        <div className="featured-publication-content">
          <h2>{featuredPublication.title}</h2>
          <p>{featuredPublication.content.substring(0, 150)}...</p>
          <Link to={`/publication/${featuredPublication.slug}`} className="btn btn-primary">
            Read More
          </Link>
        </div>
      </div>

      <div className="publication-grid">
        {otherPublications.map((pub) => (
          <div key={pub.id} className="publication-card">
            <img src={images[pub.image]} alt={pub.title} />
            <div className="publication-card-content">
              <h3>{pub.title}</h3>
              <Link to={`/publication/${pub.slug}`} className="btn btn-secondary">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publication;