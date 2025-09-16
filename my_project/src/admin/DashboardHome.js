import React, { useState, useEffect, useContext } from 'react';
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
import { ThemeContext } from '../context/ThemeContext';
import { useDashboard } from './Dashboard';
import './DashboardHome.css'; // Import the new CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ icon, value, label, theme }) => {
  return (
    <Card className={`stat-card ${theme}`}>
      <Card.Body>
        <i className={icon}></i>
        <h3>{value}</h3>
        <p>{label}</p>
      </Card.Body>
    </Card>
  );
};

const DashboardHome = () => {
  console.log('DashboardHome component rendered.');
  const { theme } = useContext(ThemeContext);
  const { userData } = useDashboard();
  console.log('DashboardHome: User data received:', userData);
  const [weeklyHabitData, setWeeklyHabitData] = useState([0, 0, 0, 0, 0, 0, 0]); // Mon-Sun

  useEffect(() => {
    console.log('DashboardHome useEffect triggered.');

    const fetchHabitsForChart = async () => {
      console.log('Fetching habits for chart...');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found for fetching habits.');
          return;
        }
        const response = await fetch('http://localhost:5000/api/habits', {
          headers: {
            'x-auth-token': token,
          },
        });
        if (response.ok) {
          const habits = await response.json();
          console.log('Habits fetched for chart:', habits);
          const today = new Date();
          today.setUTCDate(today.getUTCDate() + 1); // Shift 'today' to tomorrow
          today.setUTCHours(23, 59, 59, 999); // Normalize to end of tomorrow in UTC
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setUTCDate(today.getUTCDate() - 6); // Include tomorrow and past 6 days from tomorrow

          console.log('Chart Date Range (UTC) - Adjusted:', 'oneWeekAgo:', oneWeekAgo, 'today:', today);

          const dailyCompletions = new Array(7).fill(0); // 0 for Mon, 1 for Tue, ..., 6 for Sun

          habits.forEach(habit => {
            if (habit.lastCompleted) {
              const completionDate = new Date(habit.lastCompleted);
              completionDate.setUTCHours(0, 0, 0, 0); // Normalize completion date to start of its day in UTC
              console.log('Processing habit completion:', habit.name, 'Raw lastCompleted:', habit.lastCompleted, 'Normalized Completion Date (UTC):', completionDate);
              if (completionDate >= oneWeekAgo && completionDate <= today) {
                const dayOfWeek = completionDate.getUTCDay(); // 0 for Sun, 1 for Mon, ..., 6 for Sat (UTC day)
                const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday=0, Sunday=6
                console.log('Completion date within range. Day of week (UTC):', dayOfWeek, 'Adjusted:', adjustedDayOfWeek);
                dailyCompletions[adjustedDayOfWeek]++;
              } else {
                console.log('Completion date OUT of range:', habit.name, 'Normalized Completion Date (UTC):', completionDate, 'Range:', oneWeekAgo, 'to', today);
              }
            }
          });
          console.log('Final daily completions:', dailyCompletions);
          setWeeklyHabitData(dailyCompletions);
        } else {
          console.error('Failed to fetch habits for chart.', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching habits for chart:', error);
      }
    };

    fetchHabitsForChart();
  }, [userData]); // Re-fetch habits if userData changes (e.g., after login/habit completion)

  // Use userData from useDashboard()
  const userName = userData?.name || 'User';
  const carbonSaved = userData?.carbonSaved || 0;
  const habitsFormed = userData?.habitsFormed || 0;
  const communityPoints = userData?.points || 0;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Habits Completed',
        data: weeklyHabitData, // Dynamic data
        backgroundColor: theme === 'dark' ? 'rgba(129, 199, 132, 0.6)' : 'rgba(76, 175, 80, 0.6)',
        borderColor: theme === 'dark' ? 'rgba(129, 199, 132, 1)' : 'rgba(76, 175, 80, 1)',
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
          color: theme === 'dark' ? 'var(--text-color)' : 'var(--text-color)', // Dynamic text color
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? 'var(--text-color)' : 'var(--text-color)', // Dynamic text color
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'var(--text-color)' : 'var(--text-color)', // Dynamic text color
        },
      },
    },
  };

  const stats = [
    { icon: 'fas fa-leaf', value: carbonSaved, label: 'Carbon Saved (kg)' },
    { icon: 'fas fa-check-circle', value: habitsFormed, label: 'Habits Formed' },
    { icon: 'fas fa-star', value: communityPoints, label: 'Community Points' },
  ];

  const quickLinks = [
    { icon: 'fas fa-plus-circle', label: 'Add New Habit', path: '/dashboard/habit-tracker' },
    { icon: 'fas fa-calendar-alt', label: 'View Events', path: '/dashboard/events' },
    { icon: 'fas fa-users', label: 'Community Forum', path: '/dashboard/forum' },
    { icon: 'fas fa-graduation-cap', label: 'Education', path: '/dashboard/education' },
    { icon: 'fas fa-chart-line', label: 'Impact', path: '/dashboard/impact' },
  ];

  return (
    <Container fluid className={`dashboard-home-container ${theme === 'dark' ? 'dark' : ''}`}>
      <Row>
        <Col>
          <div className="dashboard-header">
            <h1>Welcome Back, {userName}!</h1>
            <p>Here's a snapshot of your progress and our community's impact.</p>
          </div>
        </Col>
      </Row>

      <Row>
        {stats.map((stat, index) => (
          <Col key={index} md={4} className="mb-4">
            <StatCard icon={stat.icon} value={stat.value} label={stat.label} theme={theme} />
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
          <Card className="quote-of-the-day-card mb-4">
            <Card.Body>
              <h4>Quote of the Day</h4>
              <p>"The best time to plant a tree was 20 years ago. The second best time is now."</p>
              <small>- Chinese Proverb</small>
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
