import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { blogData } from './blogData';
import './Blog.css';
import { FaArrowRight } from 'react-icons/fa';

const Blog = () => {
  return (
    <div className="blog-section py-5">
      <Container>
        <h2 className="text-center mb-5 section-title-3">From Our Blog</h2>
        <Row>
          {blogData.slice(0, 3).map(post => (
            <Col key={post.id} md={4} className="mb-4">
              <Card className="h-100 blog-card shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={post.image} className="blog-card-img" />
                  <div className="card-img-overlay">
                    <div className="overlay-content">
                      <p className="author-date">{post.author} - {post.date}</p>
                    </div>
                  </div>
                </div>
                <Card.Body>
                  <Badge bg="success" className="mb-2">{post.category}</Badge>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.excerpt}</Card.Text>
                  <Link to={`/blog/${post.id}`} className="btn btn-outline-success">
                    Read More <FaArrowRight />
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
