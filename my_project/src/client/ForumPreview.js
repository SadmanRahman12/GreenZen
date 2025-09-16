import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowRight, FaHeart, FaComment } from 'react-icons/fa';
import './ForumPreview.css';

const ForumPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch a limited number of recent posts for the preview
        const response = await fetch('http://localhost:5000/api/forum?limit=3');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching forum posts for preview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Container className="forum-preview-section py-5">
        <h2 className="text-center mb-5 section-title-3">Community Forum</h2>
        <div className="text-center">Loading recent forum posts...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="forum-preview-section py-5">
        <h2 className="text-center mb-5 section-title-3">Community Forum</h2>
        <div className="text-center text-danger">Error: {error}</div>
      </Container>
    );
  }

  return (
    <div className="forum-preview-section py-5">
      <Container>
        <h2 className="text-center mb-5 section-title-3">Community Forum</h2>
        <Row>
          {posts.length > 0 ? (
            posts.map(post => (
              <Col key={post._id} md={4} className="mb-4">
                <Card className="h-100 forum-post-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="post-title-preview">{post.title}</Card.Title>
                    <Card.Text className="post-author-preview">
                      By {post.authorName || 'Anonymous'} on {new Date(post.date).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className="post-content-preview">
                      {post.content.substring(0, 100)}...
                    </Card.Text>
                    <div className="post-stats-preview">
                      <span><FaHeart /> {post.likes ? post.likes.length : 0}</span>
                      <span><FaComment /> {post.comments ? post.comments.length : 0}</span>
                    </div>
                    <Link to={`/forum/${post._id}`} className="btn btn-outline-success btn-sm mt-3">
                      Read More <FaArrowRight />
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No forum posts available yet. Be the first to post!</p>
            </Col>
          )}
        </Row>
        <div className="text-center mt-4">
          <Link to="/community-forum" className="btn btn-success btn-lg">
            View All Forum Posts <FaArrowRight />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default ForumPreview;