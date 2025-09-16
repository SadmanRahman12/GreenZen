import React, { useState, useEffect } from 'react';
import challengesData from '../data/challenges.json';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import { FaLeaf, FaFire, FaStar, FaCalendar, FaCheck, FaTimes, FaPlus, FaEdit, FaTrash, FaChartLine } from 'react-icons/fa';
import DailyChallenge from '../client/DailyChallenge';
import './DashboardChallenges.css';

const DashboardChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    completionRate: 0,
  });
  
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: 'general',
    points: 10,
    difficulty: 'easy',
    icon: 'fas fa-leaf',
  });

  useEffect(() => {
    // Load challenges from local JSON
    setChallenges(challengesData);
    setLoading(false);
    // Optionally, set mock user progress
    setUserProgress({
      completedChallenges: [],
      totalPoints: 0,
      streaks: { current: 0, longest: 0 },
      level: 1,
    });
  }, []);

  // fetchChallenges removed, using local data

  // fetchUserProgress removed, using mock data in useEffect

  const createChallenge = async () => {
    try {
      const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/challenges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newChallenge),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewChallenge({
          title: '',
          description: '',
          category: 'general',
          points: 10,
          difficulty: 'easy',
          icon: 'fas fa-leaf',
        });
        alert('Challenge created successfully!');
      } else {
        alert('Failed to create challenge');
      }
    } catch (err) {
      alert('Error creating challenge');
    }
  };

  const completeChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:5000/api/challenges/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ challengeId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Challenge completed! You earned ${data.pointsEarned} points!`);
      } else {
        alert('Failed to complete challenge');
      }
    } catch (err) {
      alert('Error completing challenge');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      energy: 'fas fa-bolt',
      transport: 'fas fa-bicycle',
      waste: 'fas fa-recycle',
      water: 'fas fa-tint',
      food: 'fas fa-apple-alt',
      general: 'fas fa-leaf',
    };
    return icons[category] || 'fas fa-leaf';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  const getFilteredChallenges = () => {
    if (filter === 'all') return challenges;
    if (filter === 'completed') {
      return challenges.filter(challenge => 
        userProgress?.completedChallenges?.some(cc => cc.challenge === challenge._id)
      );
    }
    if (filter === 'pending') {
      return challenges.filter(challenge => 
        !userProgress?.completedChallenges?.some(cc => cc.challenge === challenge._id)
      );
    }
    return challenges.filter(challenge => challenge.category === filter);
  };

  const StatsCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <Card className="stats-card">
      <Card.Body>
        <div className="stats-content">
          <div className={`stats-icon ${color}`}>
            <i className={icon}></i>
          </div>
          <div className="stats-details">
            <h3>{value}</h3>
            <h6>{title}</h6>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const ChallengeCard = ({ challenge }) => {
    const isCompleted = userProgress?.completedChallenges?.some(
      cc => cc.challenge === challenge._id
    );

    return (
      <Card className={`challenge-card ${isCompleted ? 'completed' : ''}`}>
        <Card.Body>
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className={challenge.icon || getCategoryIcon(challenge.category)}></i>
            </div>
            <div className="challenge-badges">
              <Badge bg={getDifficultyColor(challenge.difficulty)} className="difficulty-badge">
                {challenge.difficulty}
              </Badge>
              <Badge bg="outline-primary" className="category-badge">
                {challenge.category}
              </Badge>
            </div>
          </div>

          <h6 className="challenge-title">{challenge.title}</h6>
          <p className="challenge-description">{challenge.description}</p>

          <div className="challenge-footer">
            <div className="challenge-points">
              <FaStar className="points-star" />
              <span>{challenge.points} points</span>
            </div>

            <div className="challenge-actions">
              {isCompleted ? (
                <Button variant="success" size="sm" disabled>
                  <FaCheck className="me-2" />
                  Completed
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => completeChallenge(challenge._id)}
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const CreateChallengeModal = () => (
    <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Challenge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Challenge title"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newChallenge.category}
                  onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                >
                  <option value="energy">Energy</option>
                  <option value="transport">Transport</option>
                  <option value="waste">Waste</option>
                  <option value="water">Water</option>
                  <option value="food">Food</option>
                  <option value="general">General</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe the challenge"
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="100"
                  value={newChallenge.points}
                  onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={newChallenge.difficulty}
                  onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Icon Class</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="fas fa-leaf"
                  value={newChallenge.icon}
                  onChange={(e) => setNewChallenge({...newChallenge, icon: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={createChallenge}
          disabled={!newChallenge.title || !newChallenge.description}
        >
          Create Challenge
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading challenges...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-challenges">
      <Container fluid>
        <div className="challenges-header">
          <div className="header-content">
            <h2>
              <FaLeaf className="me-3" />
              Challenge Management
            </h2>
            <p>Track your progress and manage eco-friendly challenges</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            className="create-challenge-btn"
          >
            <FaPlus className="me-2" />
            Create Challenge
          </Button>
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-check-circle"
              title="Completed"
              value={stats.totalCompleted}
              subtitle="Total challenges"
              color="success"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-fire"
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              subtitle="Keep it up!"
              color="warning"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-star"
              title="Total Points"
              value={stats.totalPoints.toLocaleString()}
              subtitle="Eco-points earned"
              color="primary"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-chart-line"
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              subtitle="Overall progress"
              color="info"
            />
          </Col>
        </Row>

        <Tabs activeKey={filter} onSelect={setFilter} className="challenges-tabs mb-4">
          <Tab eventKey="daily" title={<><FaCalendar className="me-2" />Daily Challenge</>}>
            <DailyChallenge />
          </Tab>
          
          <Tab eventKey="all" title={<><FaLeaf className="me-2" />All Challenges</>}>
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="pending" title={<><FaTimes className="me-2" />Pending</>}>
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="completed" title={<><FaCheck className="me-2" />Completed</>}>
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="energy" title="⚡ Energy">
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="transport" title="🚲 Transport">
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="waste" title="♻️ Waste">
            <div className="challenges-grid">
              {getFilteredChallenges().map(challenge => (
                <ChallengeCard key={challenge._id} challenge={challenge} />
              ))}
            </div>
          </Tab>
        </Tabs>

        {getFilteredChallenges().length === 0 && (
          <div className="text-center py-5">
            <FaLeaf size={60} className="text-muted mb-3" />
            <h4>No challenges found</h4>
            <p className="text-muted">
              {filter === 'all' 
                ? 'Start by creating some challenges!' 
                : `No ${filter} challenges available.`}
            </p>
          </div>
        )}

        <CreateChallengeModal />
      </Container>
    </div>
  );
};

export default DashboardChallenges;