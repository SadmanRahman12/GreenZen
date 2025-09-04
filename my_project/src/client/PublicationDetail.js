import React from 'react';
import { useParams } from 'react-router-dom';
import './PublicationDetail.css';
import publicationData from './publicationData';

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

const PublicationDetail = () => {
  const { slug } = useParams();
  let publication;

  for (const category in publicationData) {
    publication = publicationData[category].find(pub => pub.slug === slug);
    if (publication) break;
  }

  if (!publication) {
    return <div>Publication not found</div>;
  }

  return (
    <div className="publication-detail-container">
      <h2>{publication.title}</h2>
      <img src={images[publication.image]} alt={publication.title} className="publication-detail-image" />
      <p><strong>Author:</strong> {publication.author}</p>
      <p>{publication.content}</p>
    </div>
  );
};

export default PublicationDetail;
