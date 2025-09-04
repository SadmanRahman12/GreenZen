import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Re-import LinkContainer
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import Logo from './Logo';
import './Header.css'; // For custom styles

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleLogoClick = () => {
    if (location.pathname.startsWith('/dashboard')) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const allNavLinks = (
    <>
      {/* Main App Links */}
      <LinkContainer to={isDashboard ? "/dashboard" : "/"}>
        <Nav.Link>Home</Nav.Link>
      </LinkContainer>
      <LinkContainer to={isDashboard ? "/dashboard/carbon-calculator" : "/carbon-calculator"}>
        <Nav.Link>Carbon Calculator</Nav.Link>
      </LinkContainer>
      <LinkContainer to={isDashboard ? "/dashboard/events" : "/events"}>
        <Nav.Link>Green Events</Nav.Link>
      </LinkContainer>
      <LinkContainer to={isDashboard ? "/dashboard/education" : "/publication"}>
        <Nav.Link>{isDashboard ? "Education" : "Publication"}</Nav.Link>
      </LinkContainer>
      <LinkContainer to={isDashboard ? "/dashboard/forum" : "/forum"}>
        <Nav.Link>Community Forum</Nav.Link>
      </LinkContainer>

      {/* Dashboard Links (Conditional) */}
      {isDashboard && (
        <>
          <NavLink to="/dashboard/impact" className="nav-link" end>
            Impact
          </NavLink>
          <LinkContainer to="/dashboard/habit-tracker">
            <Nav.Link>Habit Tracker</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/dashboard/leaderboard">
            <Nav.Link>Leaderboard</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/dashboard/settings">
            <Nav.Link>Settings</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/dashboard/profile">
            <Nav.Link>👤 Profile</Nav.Link>
          </LinkContainer>
        </>
      )}

      {/* Conditional Auth Links */}
      {!isDashboard && (
        <>
          <LinkContainer to="/register">
            <Nav.Link className="cta-button-header-register">Register</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/login">
            <Nav.Link className="cta-button-header-login">Login</Nav.Link>
          </LinkContainer>
        </>
      )}
    </>
  );

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light" sticky="top" className="header-navbar">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" /> {/* Hamburger on left */}
        <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <Logo />
        </Navbar.Brand>
        
        <Nav className="d-lg-none ms-auto"> {/* Profile link for mobile */}
          {isDashboard && (
            <LinkContainer to="/dashboard/profile">
              <Nav.Link>👤 Profile</Nav.Link>
            </LinkContainer>
          )}
        </Nav>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            {allNavLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;