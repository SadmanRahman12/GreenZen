import React, { useState, useEffect } from 'react';
import campaignsData from '../data/campaigns.json';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import { FaFlag, FaUsers, FaTrophy, FaCalendar, FaPlus, FaEdit, FaTrash, FaClock, FaFire, FaGlobe, FaLeaf, FaChartBar, FaCheck, FaUser } from 'react-icons/fa';
import './DashboardCampaigns.css';

const DashboardCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    type: 'weekly',
    duration: 7,
    startDate: '',
    endDate: '',
    category: 'custom',
    banner: '',
    challenges: [],
    rewards: {
      first: { points: 500, badge: 'Campaign Winner', description: '1st Place' },
      second: { points: 300, badge: 'Campaign Runner-up', description: '2nd Place' },
      third: { points: 200, badge: 'Campaign Achiever', description: '3rd Place' },
      participation: { points: 50, badge: 'Campaign Participant', description: 'Participation' }
    }
  });

  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalParticipants: 0,
  });

  useEffect(() => {
    setCampaigns(campaignsData);
    setLoading(false);
    // Update stats
    setStats({
      totalCampaigns: campaignsData.length,
      activeCampaigns: campaignsData.filter(c => {
        const now = new Date();
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        return now >= start && now <= end;
      }).length,
      completedCampaigns: campaignsData.filter(c => new Date() > new Date(c.endDate)).length,
      totalParticipants: campaignsData.reduce((acc, c) => acc + (c.participants?.length || 0), 0)
    });
  }, []);

  // fetchCampaigns removed, using local data or mock

  // fetchMyCampaigns removed, using local data or mock

  // Create campaign locally
  const createCampaign = () => {
    const newCampaign = {
      ...campaignForm,
      id: `camp${Date.now()}`,
      participants: [],
      challenges: campaignForm.challenges || [],
      rewards: campaignForm.rewards,
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setShowCreateModal(false);
    resetCampaignForm();
    alert('Campaign created successfully!');
  };

  // Join campaign locally
  const joinCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(c =>
      c.id === campaignId
        ? { ...c, participants: [...(c.participants || []), { user: 'me', joinedAt: new Date().toISOString(), progress: { completedChallenges: [], totalPoints: 0 } }] }
        : c
    ));
    alert('Successfully joined campaign!');
  };

  // Delete campaign locally
  const deleteCampaign = (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    alert('Campaign deleted successfully!');
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      title: '',
      description: '',
      type: 'weekly',
      duration: 7,
      startDate: '',
      endDate: '',
      category: 'custom',
      banner: '',
      challenges: [],
      rewards: {
        first: { points: 500, badge: 'Campaign Winner', description: '1st Place' },
        second: { points: 300, badge: 'Campaign Runner-up', description: '2nd Place' },
        third: { points: 200, badge: 'Campaign Achiever', description: '3rd Place' },
        participation: { points: 50, badge: 'Campaign Participant', description: 'Participation' }
      }
    });
  };

  const getCampaignIcon = (category) => {
    switch (category) {
      case 'earth-day': return <FaGlobe />;
      case 'world-environment-day': return <FaLeaf />;
      case 'zero-emissions-day': return <FaFire />;
      default: return <FaFlag />;
    }
  };

  // Format date as dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getStatusBadge = (campaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) {
      return <Badge bg="info">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge bg="success">Active</Badge>;
    } else {
      return <Badge bg="secondary">Ended</Badge>;
    }
  };

  const StatsCard = ({ icon, title, value, color = 'primary' }) => (
    <Card className="campaign-stats-card">
      <Card.Body>
        <div className="stats-content">
          <div className={`stats-icon ${color}`}>
            <i className={icon}></i>
          </div>
          <div className="stats-details">
            <h3>{value}</h3>
            <h6>{title}</h6>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const CampaignCard = ({ campaign, showActions = true }) => {
    const daysRemaining = getDaysRemaining(campaign.endDate);
    // Participation: check if 'me' is in participants
    const isParticipating = (campaign.participants || []).some(p => p.user === 'me');
    const userProgress = (campaign.participants || []).find(p => p.user === 'me')?.progress || { completedChallenges: [], totalPoints: 0 };
    const progressPercentage = isParticipating && campaign.challenges?.length
      ? (userProgress.completedChallenges.length / campaign.challenges.length) * 100
      : 0;

    return (
      <Card className={`campaign-card ${isParticipating ? 'participating' : ''}`}>
        <div className="campaign-banner">
          {campaign.banner && (
            <img src={campaign.banner} alt={campaign.title} className="campaign-banner-img" />
          )}
          <div className="campaign-overlay">
            <div className="campaign-category-icon">
              {getCampaignIcon(campaign.category)}
            </div>
            {getStatusBadge(campaign)}
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
              <FaClock className="stat-icon" />
              <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}</span>
            </div>
            <div className="stat-item">
              <FaCalendar className="stat-icon" />
              <span>Start: {formatDate(campaign.startDate)}</span>
            </div>
            <div className="stat-item">
              <FaCalendar className="stat-icon" />
              <span>End: {formatDate(campaign.endDate)}</span>
            </div>
          </div>

          {isParticipating && (
            <div className="participation-progress">
              <div className="progress-header">
                <span>Your Progress</span>
                <span>{userProgress.completedChallenges.length}/{campaign.challenges?.length || 0}</span>
              </div>
              <ProgressBar now={progressPercentage} variant="success" className="campaign-progress-bar" />
              <div className="progress-points">
                <FaTrophy className="me-1" />
                {userProgress.totalPoints || 0} points earned
              </div>
            </div>
          )}

          {showActions && (
            <div className="campaign-actions">
              {isParticipating ? (
                <Button variant="success" size="sm">
                  <FaChartBar className="me-2" />
                  View Progress
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => joinCampaign(campaign.id)}
                >
                  <FaFlag className="me-2" />
                  Join Campaign
                </Button>
              )}
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setShowEditModal(true);
                }}
              >
                <FaEdit className="me-2" />
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => deleteCampaign(campaign.id)}
              >
                <FaTrash />
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Fix form blinking by using local state and not resetting on every render
  const CampaignModal = ({ show, onHide, title, onSave, campaign = null }) => (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off">
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Campaign Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter campaign title"
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm(prev => ({...prev, title: e.target.value}))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={campaignForm.category}
                  onChange={(e) => setCampaignForm(prev => ({...prev, category: e.target.value}))}
                >
                  <option value="custom">Custom</option>
                  <option value="earth-day">Earth Day</option>
                  <option value="world-environment-day">World Environment Day</option>
                  <option value="zero-emissions-day">Zero Emissions Day</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe your campaign"
              value={campaignForm.description}
              onChange={(e) => setCampaignForm(prev => ({...prev, description: e.target.value}))}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm(prev => ({...prev, type: e.target.value}))}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="event">Special Event</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Duration (days)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="365"
                  value={campaignForm.duration}
                  onChange={(e) => setCampaignForm(prev => ({...prev, duration: parseInt(e.target.value) || 1}))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Banner URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://..."
                  value={campaignForm.banner}
                  onChange={(e) => setCampaignForm(prev => ({...prev, banner: e.target.value}))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={campaignForm.startDate}
                  onChange={(e) => setCampaignForm(prev => ({...prev, startDate: e.target.value}))}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={campaignForm.endDate}
                  onChange={(e) => setCampaignForm(prev => ({...prev, endDate: e.target.value}))}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="rewards-section">
            <h6>Reward Structure</h6>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>1st Place Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={campaignForm.rewards.first.points}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        first: { ...prev.rewards.first, points: parseInt(e.target.value) || 0 }
                      }
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>2nd Place Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={campaignForm.rewards.second.points}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        second: { ...prev.rewards.second, points: parseInt(e.target.value) || 0 }
                      }
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>3rd Place Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={campaignForm.rewards.third.points}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        third: { ...prev.rewards.third, points: parseInt(e.target.value) || 0 }
                      }
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Participation Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={campaignForm.rewards.participation.points}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        participation: { ...prev.rewards.participation, points: parseInt(e.target.value) || 0 }
                      }
                    }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onSave}
          disabled={!campaignForm.title || !campaignForm.description}
        >
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const getFilteredCampaigns = () => {
    switch (activeTab) {
      case 'active':
        return campaigns.filter(c => {
          const now = new Date();
          const start = new Date(c.startDate);
          const end = new Date(c.endDate);
          return now >= start && now <= end;
        });
      case 'upcoming':
        return campaigns.filter(c => new Date() < new Date(c.startDate));
      case 'ended':
        return campaigns.filter(c => new Date() > new Date(c.endDate));
      case 'my-campaigns':
        return myCampaigns;
      default:
        return campaigns;
    }
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
    <div className="dashboard-campaigns">
      <Container fluid>
        <div className="campaigns-header">
          <div className="header-content">
            <h2>
              <FaFlag className="me-3" />
              Campaign Management
            </h2>
            <p>Create and manage sustainability campaigns for your community</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateModal(true)}
            className="create-campaign-btn"
          >
            <FaPlus className="me-2" />
            Create Campaign
          </Button>
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-flag"
              title="Total Campaigns"
              value={stats.totalCampaigns}
              color="primary"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-play"
              title="Active Campaigns"
              value={stats.activeCampaigns}
              color="success"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-check-circle"
              title="Completed"
              value={stats.completedCampaigns}
              color="info"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatsCard
              icon="fas fa-users"
              title="Total Participants"
              value={stats.totalParticipants}
              color="warning"
            />
          </Col>
        </Row>

        {/* Campaign Tabs */}
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="campaigns-tabs mb-4">
          <Tab eventKey="active" title={<><FaFire className="me-2" />Active</>}>
            <div className="campaigns-grid">
              {getFilteredCampaigns().map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="upcoming" title={<><FaClock className="me-2" />Upcoming</>}>
            <div className="campaigns-grid">
              {getFilteredCampaigns().map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="ended" title={<><FaCheck className="me-2" />Ended</>}>
            <div className="campaigns-grid">
              {getFilteredCampaigns().map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </Tab>

          <Tab eventKey="my-campaigns" title={<><FaUser className="me-2" />My Campaigns</>}>
            <div className="campaigns-grid">
              {getFilteredCampaigns().map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </Tab>
        </Tabs>

        {getFilteredCampaigns().length === 0 && (
          <div className="text-center py-5">
            <FaFlag size={60} className="text-muted mb-3" />
            <h4>No campaigns found</h4>
            <p className="text-muted">
              {activeTab === 'my-campaigns' 
                ? "You haven't created any campaigns yet." 
                : `No ${activeTab} campaigns available.`}
            </p>
          </div>
        )}

        {/* Modals */}
        <CampaignModal
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            resetCampaignForm();
          }}
          title="Create New Campaign"
          onSave={createCampaign}
        />

        <CampaignModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedCampaign(null);
            resetCampaignForm();
          }}
          title="Edit Campaign"
          onSave={createCampaign}
          campaign={selectedCampaign}
        />
      </Container>
    </div>
  );
};

export default DashboardCampaigns;