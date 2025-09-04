import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons
import './AuthForms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'email' || name === 'username' ? value.trim() : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Set loading to true on submission
      console.log('Attempting to register with data:', formData);
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        console.log('Response Content-Type:', response.headers.get('content-type'));

        if (response.ok) {
          alert('Registration successful! Please log in.');
          navigate('/login');
        } else {
          let errorMessage = 'Unknown error';
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Registration failed with error data:', errorData);
            errorMessage = errorData.message || 'Unknown error';
          } else {
            const errorText = await response.text();
            console.error('Registration failed with non-JSON response:', errorText);
            errorMessage = `Server error: ${response.status} ${response.statusText || ''}. Please check backend logs.`;
          }
          alert(`Registration failed: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    }
  };

  return (
    <Container 
      className="auth-container"
    >
      {/* Background Shapes removed */}

      <Card className="auth-card">
        <Card.Body>
          <div className="logo-container">
            <Logo />
          </div>
          <h2 className="text-center">Create your GreenZen Account</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                placeholder=" " // Important for floating label
              />
              <Form.Label>Username</Form.Label> {/* Label after control for CSS selector */}
              <FaUser className="input-icon" /> {/* Icon for username */}
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                placeholder=" " // Important for floating label
              />
              <Form.Label>Email address</Form.Label> {/* Label after control for CSS selector */}
              <FaEnvelope className="input-icon" /> {/* Icon for email */}
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder=" " // Important for floating label
              />
              <Form.Label>Password</Form.Label> {/* Label after control for CSS selector */}
              <FaLock className="input-icon" /> {/* Icon for password */}
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                placeholder=" " // Important for floating label
              />
              <Form.Label>Confirm Password</Form.Label> {/* Label after control for CSS selector */}
              <FaLock className="input-icon" /> {/* Icon for confirm password */}
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="success" type="submit" className="auth-button" disabled={loading}> {/* Disable button when loading */}
              {loading ? <Spinner animation="border" size="sm" /> : 'Register'} {/* Show spinner when loading */}
            </Button>
          </Form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
