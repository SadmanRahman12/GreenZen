import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Form, Alert, Modal, Spinner } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaStar, FaFire, FaUsers, FaGlobe, FaMapMarkerAlt, FaSword, FaPlus } from 'react-icons/fa';
import BadgeDisplay from '../components/BadgeDisplay';
import './DashboardLeaderboard.css';

const DashboardLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('allTime');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [ecoBattles, setEcoBattles] = useState([]);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    if (activeTab === 'friends') {
      fetchEcoBattles();
    }
  }, [activeTab, period, region, city]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      let endpoint = '/api/leaderboard/global';
      let params = new URLSearchParams({ period });

      if (activeTab === 'friends') {
        endpoint = '/api/leaderboard/friends';
      } else if (activeTab === 'regional') {
        endpoint = '/api/leaderboard/regional';
        if (region) params.append('region', region);
        if (city) params.append('city', city);
      }

      const response = await fetch(`${endpoint}?${params}`, {
        headers: { 'x-auth-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setCurrentUser(data.currentUser || null);
      } else {
        setError('Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchEcoBattles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/leaderboard/eco-battles', {
        headers: { 'x-auth-token': token },
      });

      if (response.ok) {
        const data = await response.json();
        setEcoBattles(data.battles || []);
      }
    } catch (err) {
      console.error('Error fetching eco-battles:', err);
    }
  };

  const addFriend = async () => {
    if (!friendUsername.trim()) return;
    
    setAddingFriend(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/leaderboard/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ friendUsername: friendUsername.trim() }),
      });

      if (response.ok) {
        setFriendUsername('');
        setShowAddFriendModal(false);
        await fetchLeaderboard();
        alert('Friend added successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add friend');
      }
    } catch (err) {
      alert('Error adding friend');
    } finally {
      setAddingFriend(false);
    }
  };

  const createEcoBattle = async (friendId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/leaderboard/eco-battle/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ friendId, duration: 7 }),
      });

      if (response.ok) {
        await fetchEcoBattles();
        alert('Eco-battle created! Challenge your friend to see who can earn more points in the next 7 days!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create eco-battle');
      }
    } catch (err) {
      alert('Error creating eco-battle');
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="rank-icon gold" />;
      case 2:
        return <FaMedal className="rank-icon silver" />;
      case 3:
        return <FaMedal className="rank-icon bronze" />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  const LeaderboardItem = ({ user, rank, showActions = false }) => (
    <div className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}>
      <div className="rank-section">
        {getRankIcon(rank)}
      </div>
      
      <div className="user-info">
        <img 
          src={user.user.avatar || `https://i.pravatar.cc/150?u=${user.user.username}`} 
          alt={user.user.username}
          className="user-avatar"
        />
        <div className="user-details">
          <h6 className="username">{user.user.username}</h6>
          <div className="user-stats">
            <span className="points">
              <FaStar className="me-1" />
              {user.points.toLocaleString()} pts
            </span>
            {user.level && (
              <span className="level">
                Level {user.level}
              </span>
            )}
            {user.streak && (
              <span className="streak">
                <FaFire className="me-1" />
                {user.streak} days
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="user-badges">
        {user.badges && user.badges.slice(0, 3).map((badge, index) => (
          <BadgeDisplay key={index} badge={badge} size="sm" />
        ))}
      </div>

      {showActions && !user.isCurrentUser && (
        <div className="user-actions">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => createEcoBattle(user.user.id)}
          >
            <FaSword className="me-1" />
            Battle
          </Button>
        </div>
      )}
    </div>
  );

  const EcoBattleCard = ({ battle }) => (
    <Card className="eco-battle-card">
      <Card.Body>
        <div className="battle-header">
          <h6>
            <FaSword className="me-2" />
            Eco-Battle vs {battle.opponent.username}
          </h6>
          <Badge bg={battle.status === 'active' ? 'success' : 'secondary'}>
            {battle.status}
          </Badge>
        </div>
        
        <div className="battle-progress">
          <div className="battle-score">
            <div className="score-item">
              <span>You</span>
              <strong>{battle.myPoints} pts</strong>
            </div>
            <div className="vs-divider">VS</div>
            <div className="score-item">
              <span>{battle.opponent.username}</span>
              <strong>{battle.opponentPoints} pts</strong>
            </div>
          </div>
          
          {battle.status === 'active' && (
            <div className="battle-time">
              <FaFire className="me-1" />
              {battle.daysRemaining} days remaining
            </div>
          )}
          
          {battle.winner && (
            <div className="battle-winner">
              <FaTrophy className="me-1" />
              Winner: {battle.winner === battle.opponent._id ? battle.opponent.username : 'You'}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  const CurrentUserCard = () => (
    currentUser && (
      <Card className="current-user-card">
        <Card.Body>
          <h5>Your Ranking</h5>
          <div className="current-user-stats">
            <div className="stat-item">
              <FaTrophy className="stat-icon" />
              <div>
                <strong>#{currentUser.rank || 'Unranked'}</strong>
                <small>Global Rank</small>
              </div>
            </div>
            <div className="stat-item">
              <FaStar className="stat-icon" />
              <div>
                <strong>{currentUser.points.toLocaleString()}</strong>
                <small>Total Points</small>
              </div>
            </div>
            <div className="stat-item">
              <div className="level-badge">
                Level {currentUser.level}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  );

  return (
    <div className="dashboard-leaderboard">
      <Container fluid>
        <div className="leaderboard-header">
          <h2>
            <FaTrophy className="me-3" />
            Leaderboard & Competitions
          </h2>
          <p>Compete with others and track your environmental impact rankings</p>
        </div>

        <Row>
          <Col lg={9}>
            <Card className="leaderboard-main-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <Tabs activeKey={activeTab} onSelect={setActiveTab} className="leaderboard-tabs">
                    <Tab eventKey="global" title={<><FaGlobe className="me-2" />Global</>} />
                    <Tab eventKey="regional" title={<><FaMapMarkerAlt className="me-2" />Regional</>} />
                    <Tab eventKey="friends" title={<><FaUsers className="me-2" />Friends</>} />
                  </Tabs>

                  <div className="leaderboard-controls">
                    {activeTab === 'friends' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowAddFriendModal(true)}
                      >
                        <FaPlus className="me-1" />
                        Add Friend
                      </Button>
                    )}
                    
                    {activeTab !== 'friends' && (
                      <Form.Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        size="sm"
                        style={{ width: 'auto' }}
                      >
                        <option value="allTime">All Time</option>
                        <option value="monthly">This Month</option>
                        <option value="weekly">This Week</option>
                        <option value="daily">Today</option>
                      </Form.Select>
                    )}
                  </div>
                </div>

                {activeTab === 'regional' && (
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Control
                        placeholder="Region (e.g., Asia, Europe)"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        size="sm"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        placeholder="City (e.g., Tokyo, London)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        size="sm"
                      />
                    </Col>
                  </Row>
                )}
              </Card.Header>

              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3">Loading leaderboard...</p>
                  </div>
                ) : (
                  <div className="leaderboard-list">
                    {leaderboard.length === 0 ? (
                      <div className="text-center py-5">
                        <FaUsers size={60} className="text-muted mb-3" />
                        <h5>No rankings available</h5>
                        <p className="text-muted">
                          {activeTab === 'friends' 
                            ? 'Add some friends to see their rankings!'
                            : 'Complete some challenges to appear on the leaderboard!'
                          }
                        </p>
                      </div>
                    ) : (
                      leaderboard.map((user, index) => (
                        <LeaderboardItem
                          key={user.user.id}
                          user={user}
                          rank={user.rank}
                          showActions={activeTab === 'friends'}
                        />
                      ))
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3}>
            <div className="leaderboard-sidebar">
              <CurrentUserCard />

              {activeTab === 'friends' && ecoBattles.length > 0 && (
                <Card className="eco-battles-card">
                  <Card.Header>
                    <h6>
                      <FaSword className="me-2" />
                      Eco-Battles
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="eco-battles-list">
                      {ecoBattles.map(battle => (
                        <EcoBattleCard key={battle.id} battle={battle} />
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>

        {/* Add Friend Modal */}
        <Modal show={showAddFriendModal} onHide={() => setShowAddFriendModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Friend</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter friend's username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFriend()}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddFriendModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={addFriend} 
              disabled={addingFriend || !friendUsername.trim()}
            >
              {addingFriend ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Adding...
                </>
              ) : (
                'Add Friend'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default DashboardLeaderboard;