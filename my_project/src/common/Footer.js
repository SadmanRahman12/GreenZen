import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from './Logo'; // Assuming you have a Logo component
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <Container>
        <Row className="gy-4">
          {/* About Section */}
          <Col lg={4} md={12} className="footer-about">
            <Logo />
            <p className="mt-3">
              A platform dedicated to promoting environmental consciousness and sustainable living. Join our community to make a positive impact.
            </p>
            <div className="social-icons mt-4">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/carbon-calculator">Carbon Calculator</a></li>
              <li><a href="/dashboard/habit-tracker">Habit Tracker</a></li>
              <li><a href="/events">Green Events</a></li>
            </ul>
          </Col>

          {/* Learn More */}
          <Col lg={2} md={6}>
            <h5>Learn More</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={12} className="footer-newsletter">
            <h5>Join Our Newsletter</h5>
            <p>Get weekly tips on sustainable living directly to your inbox.</p>
            <Form>
              <InputGroup className="mt-3">
                <Form.Control
                  type="email"
                  placeholder="Your email address"
                  aria-label="Your email address"
                />
                <Button variant="success" type="submit">Subscribe</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GreenZen. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
