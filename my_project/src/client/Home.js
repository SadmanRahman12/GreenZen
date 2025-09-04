import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaLeaf, FaCheckCircle, FaMapMarkerAlt, FaTree, FaSmog, FaTint, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import { blogData } from './blogData';
import './Home.css';
import './Blog.css';

const Home = () => {
  return (
    <>
      <div className="hero-section-3">
        <div className="hero-overlay-3"></div>
        <Container className="hero-content-3 text-center text-white">
          <h1 className="display-3 animated-title">Welcome to GreenZen</h1>
          <p className="lead animated-subtitle">
            A new era of environmental consciousness starts with you.
          </p>
          <Button variant="success" size="lg" href="#" className="me-2 animated-button">Join the Movement</Button>
          <Button variant="outline-light" size="lg" href="#" className="animated-button">Learn More</Button>
        </Container>
      </div>

      <Container className="my-5 impact-section">
        <h2 className="text-center mb-5 section-title-3">Our Community's Impact</h2>
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <div className="impact-card-3">
              <FaTree className="impact-icon-3 text-success" />
              <h3><CountUp end={12345} duration={3} /></h3>
              <p className="text-muted">Trees Planted</p>
              <p>Our community has planted thousands of trees, reforesting our planet one seed at a time.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="impact-card-3">
              <FaSmog className="impact-icon-3 text-primary" />
              <h3><CountUp end={6789} duration={3} /> kg</h3>
              <p className="text-muted">CO₂ Reduced</p>
              <p>We're actively reducing our carbon footprint and combating climate change together.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="impact-card-3">
              <FaTint className="impact-icon-3 text-info" />
              <h3><CountUp end={98765} duration={3} /> L</h3>
              <p className="text-muted">Water Saved</p>
              <p>Every drop counts. Our collective efforts have saved a significant amount of water.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="features-section-3 py-5">
        <Container>
          <h2 className="text-center mb-5 section-title-3">Everything You Need to Make a Difference</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center feature-card-3">
                <Card.Body>
                  <FaLeaf className="feature-icon-3 text-success" />
                  <Card.Title>Calculate Your Impact</Card.Title>
                  <Card.Text>
                    Our advanced calculator helps you understand your carbon footprint.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center feature-card-3">
                <Card.Body>
                  <FaCheckCircle className="feature-icon-3 text-success" />
                  <Card.Title>Track Your Habits</Card.Title>
                  <Card.Text>
                    Build sustainable habits with our dynamic tracking tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center feature-card-3">
                <Card.Body>
                  <FaMapMarkerAlt className="feature-icon-3 text-success" />
                  <Card.Title>Join Green Events</Card.Title>
                  <Card.Text>
                    Find and participate in local environmental initiatives.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

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
                        <img src={post.authorAvatar} alt={post.author} className="author-avatar" />
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

      <div className="testimonials-section py-5">
        <Container>
          <h2 className="text-center mb-5 section-title-3">What Our Community Says</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 testimonial-card">
                <Card.Body>
                  <FaQuoteLeft className="testimonial-icon" />
                  <Card.Text>
                    GreenZen has completely changed the way I think about my impact on the environment. It's so empowering!
                  </Card.Text>
                  <p className="testimonial-author">- Sarah J.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 testimonial-card">
                <Card.Body>
                  <FaQuoteLeft className="testimonial-icon" />
                  <Card.Text>
                    I love the community aspect of GreenZen. It's great to know that I'm not alone in this journey.
                  </Card.Text>
                  <p className="testimonial-author">- Michael B.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 testimonial-card">
                <Card.Body>
                  <FaQuoteLeft className="testimonial-icon" />
                  <Card.Text>
                    The habit tracker is my favorite feature. It's so motivating to see my progress over time.
                  </Card.Text>
                  <p className="testimonial-author">- Emily L.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="cta-section-3 text-center text-white py-5">
        <Container>
          <h2 className="display-4">Ready to Make a Change?</h2>
          <p className="lead">
            Join thousands of others on their journey to a more sustainable future.
          </p>
          <Button variant="success" size="lg" href="#">Sign Up Now</Button>
        </Container>
      </div>
    </>
  );
};

export default Home;
