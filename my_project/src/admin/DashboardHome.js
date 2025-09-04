import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';
import '../admin/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnimatedStatCard = ({ icon, value, label }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    delay: 200,
    config: { duration: 1000 },
  });

  return (
    <Card className="stat-card">
      <Card.Body>
        <i className={icon}></i>
        <animated.h3>{number.to(n => n.toFixed(0))}</animated.h3>
        <p>{label}</p>
      </Card.Body>
    </Card>
  );
};

const DashboardHome = () => {
  const [userData, setUserData] = useState({ username: 'User' });
  const [quote, setQuote] = useState({
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
  });
  const [textColor, setTextColor] = useState('#000');

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/user/settings', {
          headers: {
            'x-auth-token': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchQuote = async () => {
      try {
        const response = await fetch('https://type.fit/api/quotes');
        const data = await response.json();
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote);
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchUserData();
    fetchQuote();

    const bodyStyles = getComputedStyle(document.body);
    setTextColor(bodyStyles.getPropertyValue('--text-color'));
    setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');

    const observer = new MutationObserver(() => {
      const newBodyStyles = getComputedStyle(document.body);
      setTextColor(newBodyStyles.getPropertyValue('--text-color'));
      setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Habits Completed',
        data: [5, 7, 8, 6, 9, 7, 10],
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Your Weekly Habit Progress',
        font: {
          size: 18,
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
      },
    },
  };

  const stats = [
    { icon: 'fas fa-leaf', value: 1250, label: 'Carbon Saved (kg)' },
    { icon: 'fas fa-check-circle', value: 82, label: 'Habits Formed' },
    { icon: 'fas fa-star', value: 4500, label: 'Community Points' },
  ];

  const quickLinks = [
    { icon: 'fas fa-plus-circle', label: 'Add New Habit', path: '/dashboard/habit-tracker' },
    { icon: 'fas fa-calendar-alt', label: 'View Events', path: '/dashboard/events' },
    { icon: 'fas fa-users', label: 'Community Forum', path: '/forum' },
  ];

  return (
    <Container fluid className={`dashboard-home ${theme}`}>
      <Row>
        <Col>
          <div className="dashboard-header">
            <h1>Welcome Back, {userData.username}!</h1>
                      <p>Here's a snapshot of your progress and our community's impact.</p>
          </div>
        </Col>
      </Row>

      <Row>
        {stats.map((stat, index) => (
          <Col key={index} md={4} className="mb-4">
            <AnimatedStatCard icon={stat.icon} value={stat.value} label={stat.label} />
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={8} className="mb-4">
          <Card className="chart-container">
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Bar key={theme} data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="progress-card mb-4">
            <Card.Body>
              <h4>Your Level</h4>
              <div className="progress-bar-container">
                <div className="progress-bar"></div>
              </div>
              <small>Level 5 - 75% to Level 6</small>
            </Card.Body>
          </Card>
          <Card className="tip-of-the-day-card mb-4">
            <Card.Body>
              <h4>Quote of the Day</h4>
              <p>"{quote.text}"</p>
              <small>- {quote.author || 'Unknown'}</small>
            </Card.Body>
          </Card>
          <Card className="quick-links-card">
            <Card.Body>
              <h4>Quick Links</h4>
              <ul className="list-unstyled">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.path}>
                      <i className={link.icon}></i>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardHome;