import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { FaCheck, FaTimes, FaStar, FaFire } from 'react-icons/fa';
import './DailyChallenge.css';

const DailyChallenge = ({ showAsWidget = false }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStats, setUserStats] = useState({
    streak: 0,
    totalPoints: 0,
    level: 1,
  });

  useEffect(() => {
    fetchDailyChallenge();
    fetchUserStats();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/challenges/daily', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChallenge(data);
      } else {
        setError('Failed to fetch daily challenge');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/settings', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // This would come from a user progress endpoint in a real implementation
        setUserStats({
          streak: data.streak || 0,
          totalPoints: data.totalPoints || 0,
          level: data.level || 1,
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const completeChallenge = async () => {
    setCompleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/challenges/daily/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Great job! You earned ${data.pointsEarned} points!`);
        setChallenge(prev => ({ ...prev, completed: true, completedAt: new Date() }));
        setUserStats(prev => ({
          ...prev,
          totalPoints: data.totalPoints,
          level: data.level,
          streak: data.streak,
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to complete challenge');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setCompleting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = (userStats.level - 1) * 100;
    const nextLevelXP = userStats.level * 100;
    const currentXP = userStats.totalPoints - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    return Math.min((currentXP / neededXP) * 100, 100);
  };

  if (loading) {
    return (
      <Card className={`daily-challenge-card ${showAsWidget ? 'widget-mode' : ''}`}>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 mb-0">Loading your daily challenge...</p>
        </Card.Body>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card className={`daily-challenge-card ${showAsWidget ? 'widget-mode' : ''}`}>
        <Card.Body className="text-center">
          <Alert variant="info">No challenge available today. Check back tomorrow!</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={`daily-challenge-card ${showAsWidget ? 'widget-mode' : ''} ${challenge.completed ? 'completed' : ''}`}>
      <Card.Header className="daily-challenge-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="challenge-title-section">
            <h5 className="mb-0">
              <i className="fas fa-calendar-day me-2"></i>
              Daily Challenge
            </h5>
            <small className="text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</small>
          </div>
          <div className="challenge-status">
            {challenge.completed ? (
              <Badge bg="success" className="completed-badge">
                <FaCheck className="me-1" /> Completed
              </Badge>
            ) : (
              <Badge bg={getDifficultyColor(challenge.challenge?.difficulty)} className="difficulty-badge">
                {challenge.challenge?.difficulty || 'easy'}
              </Badge>
            )}
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        
        <div className="challenge-content">
          <div className="challenge-icon-section">
            <div className="challenge-icon">
              <i className={challenge.challenge?.icon || 'fas fa-leaf'}></i>
            </div>
            <div className="challenge-points">
              <FaStar className="points-star" />
              <span>{challenge.challenge?.points || 0} pts</span>
            </div>
          </div>

          <div className="challenge-details">
            <h6 className="challenge-title">{challenge.challenge?.title}</h6>
            <p className="challenge-description">{challenge.challenge?.description}</p>
            
            <div className="challenge-category">
              <Badge bg="outline-primary" className="category-badge">
                {challenge.challenge?.category?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {!showAsWidget && (
          <div className="user-stats-section">
            <div className="row text-center">
              <div className="col-4">
                <div className="stat-item">
                  <FaFire className="stat-icon streak-icon" />
                  <div className="stat-value">{userStats.streak}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-item">
                  <FaStar className="stat-icon points-icon" />
                  <div className="stat-value">{userStats.totalPoints}</div>
                  <div className="stat-label">Total Points</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-item">
                  <i className="fas fa-level-up-alt stat-icon level-icon"></i>
                  <div className="stat-value">Level {userStats.level}</div>
                  <ProgressBar 
                    now={getProgressToNextLevel()} 
                    className="level-progress mt-2"
                    variant="success"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="challenge-actions">
          {challenge.completed ? (
            <div className="completed-message">
              <FaCheck className="completed-check" />
              <span>Challenge completed at {new Date(challenge.completedAt).toLocaleTimeString()}</span>
            </div>
          ) : (
            <Button
              variant="success"
              onClick={completeChallenge}
              disabled={completing}
              className="complete-challenge-btn"
              size={showAsWidget ? 'sm' : 'lg'}
            >
              {completing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Completing...
                </>
              ) : (
                <>
                  <FaCheck className="me-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          )}
        </div>

        {showAsWidget && (
          <div className="widget-footer">
            <small className="text-muted">
              {userStats.streak > 0 && (
                <>
                  <FaFire className="me-1" />
                  {userStats.streak} day streak
                </>
              )}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DailyChallenge;