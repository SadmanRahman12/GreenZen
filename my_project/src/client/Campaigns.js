import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert, Modal, Spinner } from 'react-bootstrap';
import { FaCalendar, FaTrophy, FaUsers, FaClock, FaFlag, FaLeaf, FaGlobe, FaFire } from 'react-icons/fa';
import './Campaigns.css';

const Campaigns = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [upcomingCampaigns, setUpcomingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const [activeResponse, upcomingResponse] = await Promise.all([
        fetch('/api/campaigns/active', {
          headers: { 'x-auth-token': token },
        }),
        fetch('/api/campaigns/upcoming', {
          headers: { 'x-auth-token': token },
        }),
      ]);

      if (activeResponse.ok && upcomingResponse.ok) {
        const activeData = await activeResponse.json();
        const upcomingData = await upcomingResponse.json();
        
        setActiveCampaigns(activeData);
        setUpcomingCampaigns(upcomingData);
      } else {
        setError('Failed to fetch campaigns');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId) => {
    setJoining(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/campaigns/${campaignId}/join`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        // Refresh campaigns to show updated participation status
        await fetchCampaigns();
        setShowModal(false);
        alert('Successfully joined campaign!');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError('Error joining campaign');
    } finally {
      setJoining(false);
    }
  };

  const getCampaignIcon = (category) => {
    switch (category) {
      case 'earth-day':
        return <FaGlobe />;
      case 'world-environment-day':
        return <FaLeaf />;
      case 'zero-emissions-day':
        return <FaFire />;
      default:
        return <FaFlag />;
    }
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressPercentage = (userProgress, totalChallenges) => {
    if (!userProgress || !totalChallenges) return 0;
    return Math.min((userProgress.completedChallenges.length / totalChallenges) * 100, 100);
  };

  const CampaignCard = ({ campaign, isUpcoming = false }) => {
    const daysRemaining = getDaysRemaining(campaign.endDate);
    const progressPercentage = getProgressPercentage(campaign.userProgress, campaign.challenges?.length);

    return (
      <Col lg={6} xl={4} className="mb-4">
        <Card className={`campaign-card ${campaign.isParticipating ? 'participating' : ''} ${isUpcoming ? 'upcoming' : ''}`}>
          <div className="campaign-banner">
            {campaign.banner && (
              <img src={campaign.banner} alt={campaign.title} className="campaign-banner-img" />
            )}
            <div className="campaign-overlay">
              <div className="campaign-category-icon">
                {getCampaignIcon(campaign.category)}
              </div>
              <Badge bg={isUpcoming ? 'info' : 'success'} className="campaign-status-badge">
                {isUpcoming ? 'Upcoming' : daysRemaining > 0 ? `${daysRemaining} days left` : 'Ending Soon'}
              </Badge>
            </div>
          </div>

          <Card.Body>
            <div className="campaign-header">
              <h5 className="campaign-title">{campaign.title}</h5>
              <Badge bg="outline-primary" className="campaign-duration">
                {campaign.duration} days
              </Badge>
            </div>

            <p className="campaign-description">{campaign.description}</p>

            <div className="campaign-stats">
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <span>{campaign.participants?.length || 0} participants</span>
              </div>
              <div className="stat-item">
                <FaTrophy className="stat-icon" />
                <span>{campaign.challenges?.length || 0} challenges</span>
              </div>
              <div className="stat-item">
                <FaCalendar className="stat-icon" />
                <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            {campaign.isParticipating && !isUpcoming && (
              <div className="participation-progress">
                <div className="progress-header">
                  <span>Your Progress</span>
                  <span>{campaign.userProgress?.completedChallenges?.length || 0}/{campaign.challenges?.length || 0}</span>
                </div>
                <ProgressBar
                  now={progressPercentage}
                  variant="success"
                  className="campaign-progress-bar"
                />
                <div className="progress-points">
                  <FaTrophy className="me-1" />
                  {campaign.userProgress?.totalPoints || 0} points earned
                </div>
              </div>
            )}

            {campaign.rewards && (
              <div className="campaign-rewards">
                <h6>Rewards</h6>
                <div className="rewards-grid">
                  <div className="reward-item">
                    <div className="reward-position">🥇</div>
                    <div>{campaign.rewards.first?.points || 0} pts</div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-position">🥈</div>
                    <div>{campaign.rewards.second?.points || 0} pts</div>
                  </div>
                  <div className="reward-item">
                    <div className="reward-position">🥉</div>
                    <div>{campaign.rewards.third?.points || 0} pts</div>
                  </div>
                </div>
              </div>
            )}

            <div className="campaign-actions">
              {isUpcoming ? (
                <Button variant="outline-primary" disabled>
                  <FaClock className="me-2" />
                  Starts {new Date(campaign.startDate).toLocaleDateString()}
                </Button>
              ) : campaign.isParticipating ? (
                <Button
                  variant="success"
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowModal(true);
                  }}
                >
                  View Progress
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => joinCampaign(campaign._id)}
                  disabled={joining}
                >
                  {joining ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <FaFlag className="me-2" />
                      Join Campaign
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const CampaignModal = () => {
    if (!selectedCampaign) return null;

    const progressPercentage = getProgressPercentage(
      selectedCampaign.userProgress,
      selectedCampaign.challenges?.length
    );

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCampaign.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="campaign-detail-stats">
            <Row>
              <Col sm={4} className="text-center">
                <div className="detail-stat">
                  <h3>{selectedCampaign.userProgress?.completedChallenges?.length || 0}</h3>
                  <p>Challenges Completed</p>
                </div>
              </Col>
              <Col sm={4} className="text-center">
                <div className="detail-stat">
                  <h3>{selectedCampaign.userProgress?.totalPoints || 0}</h3>
                  <p>Points Earned</p>
                </div>
              </Col>
              <Col sm={4} className="text-center">
                <div className="detail-stat">
                  <h3>{Math.round(progressPercentage)}%</h3>
                  <p>Progress</p>
                </div>
              </Col>
            </Row>
          </div>

          <ProgressBar
            now={progressPercentage}
            variant="success"
            className="mb-4"
            style={{ height: '10px' }}
          />

          <h6>Available Challenges</h6>
          <div className="challenges-list">
            {selectedCampaign.challenges?.map((challenge, index) => {
              const isCompleted = selectedCampaign.userProgress?.completedChallenges?.some(
                cc => cc.challenge === challenge._id
              );
              
              return (
                <div key={index} className={`challenge-item ${isCompleted ? 'completed' : ''}`}>
                  <div className="challenge-info">
                    <i className={challenge.icon}></i>
                    <div>
                      <h6>{challenge.title}</h6>
                      <p>{challenge.description}</p>
                    </div>
                  </div>
                  <div className="challenge-points">
                    {isCompleted ? (
                      <Badge bg="success">Completed</Badge>
                    ) : (
                      <Badge bg="primary">{challenge.points} pts</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="success" />
          <p className="mt-3">Loading campaigns...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="campaigns-page py-4">
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <div className="campaigns-header mb-5">
        <h1 className="page-title">
          <FaFlag className="me-3" />
          Sustainability Campaigns
        </h1>
        <p className="page-subtitle">
          Join themed challenges and compete with the community for a greener future
        </p>
      </div>

      {activeCampaigns.length > 0 && (
        <section className="campaigns-section mb-5">
          <h2 className="section-title">
            <FaFire className="me-2" />
            Active Campaigns
          </h2>
          <Row>
            {activeCampaigns.map(campaign => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </Row>
        </section>
      )}

      {upcomingCampaigns.length > 0 && (
        <section className="campaigns-section">
          <h2 className="section-title">
            <FaClock className="me-2" />
            Upcoming Campaigns
          </h2>
          <Row>
            {upcomingCampaigns.map(campaign => (
              <CampaignCard key={campaign._id} campaign={campaign} isUpcoming={true} />
            ))}
          </Row>
        </section>
      )}

      {activeCampaigns.length === 0 && upcomingCampaigns.length === 0 && !loading && (
        <div className="text-center py-5">
          <FaFlag size={60} className="text-muted mb-3" />
          <h3>No campaigns available</h3>
          <p className="text-muted">Check back later for new sustainability campaigns!</p>
        </div>
      )}

      <CampaignModal />
    </Container>
  );
};

export default Campaigns;