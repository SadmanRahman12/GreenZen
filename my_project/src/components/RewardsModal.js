import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Badge, Alert, Spinner, Tabs, Tab, Form, InputGroup } from 'react-bootstrap';
import { FaStar, FaShoppingCart, FaHeart, FaLeaf, FaGift, FaSearch, FaFilter } from 'react-icons/fa';
import rewardsData from '../data/rewards.json';
import './RewardsModal.css';

const RewardsModal = ({ show, onHide, userPoints = 0 }) => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('pointsCost');
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (show) {
      loadRewards();
    }
  }, [show]);

  useEffect(() => {
    filterAndSortRewards();
  }, [rewards, activeCategory, searchTerm, sortBy]);

  const loadRewards = () => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setRewards(rewardsData);
      setLoading(false);
    }, 500);
  };

  const filterAndSortRewards = () => {
    let filtered = rewards.filter(reward => {
      const matchesCategory = activeCategory === 'all' || reward.category === activeCategory;
      const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reward.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && reward.inStock;
    });

    // Sort rewards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'pointsCost':
          return a.pointsCost - b.pointsCost;
        case 'pointsCost-desc':
          return b.pointsCost - a.pointsCost;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredRewards(filtered);
  };

  const redeemReward = async (reward) => {
    if (userPoints < reward.pointsCost) {
      alert('Insufficient points to redeem this reward!');
      return;
    }

    setRedeeming(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Successfully redeemed ${reward.name}! You will receive instructions via email.`);
      onHide();
    } catch (error) {
      alert('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(false);
      setSelectedReward(null);
    }
  };

  const getCategories = () => {
    const categories = ['all', ...new Set(rewards.map(reward => reward.category))];
    return categories.map(category => ({
      key: category,
      label: category === 'all' ? 'All Items' : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: getCategoryIcon(category)
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'all':
        return <FaGift />;
      case 'lifestyle':
        return <FaStar />;
      case 'home':
        return <FaLeaf />;
      case 'electronics':
        return <FaStar />;
      case 'donation':
        return <FaHeart />;
      case 'personal_care':
        return <FaStar />;
      case 'kitchen':
        return <FaLeaf />;
      case 'gardening':
        return <FaLeaf />;
      default:
        return <FaGift />;
    }
  };

  const RewardCard = ({ reward }) => {
    const canAfford = userPoints >= reward.pointsCost;
    
    return (
      <Card className={`reward-card ${!canAfford ? 'unaffordable' : ''}`}>
        <div className="reward-image-container">
          <img 
            src={reward.image} 
            alt={reward.name}
            className="reward-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          <div className="reward-overlay">
            <Badge bg={reward.category === 'donation' ? 'warning' : 'success'} className="category-badge">
              {reward.category.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <Card.Body>
          <h6 className="reward-name">{reward.name}</h6>
          <p className="reward-description">{reward.description}</p>
          
          <div className="reward-details">
            <div className="reward-cost">
              <FaStar className="points-star" />
              <strong>{reward.pointsCost.toLocaleString()} points</strong>
            </div>
            
            {reward.carbonOffset && (
              <div className="carbon-offset">
                <FaLeaf className="carbon-icon" />
                <small>Saves {reward.carbonOffset}</small>
              </div>
            )}
          </div>
          
          <Button
            variant={canAfford ? 'success' : 'outline-secondary'}
            disabled={!canAfford}
            onClick={() => setSelectedReward(reward)}
            className="redeem-btn"
            size="sm"
          >
            {canAfford ? (
              <>
                <FaShoppingCart className="me-2" />
                Redeem
              </>
            ) : (
              `Need ${(reward.pointsCost - userPoints).toLocaleString()} more points`
            )}
          </Button>
        </Card.Body>
      </Card>
    );
  };

  const RedemptionModal = () => (
    <Modal 
      show={!!selectedReward} 
      onHide={() => setSelectedReward(null)} 
      centered
      size="lg"
    >
      {selectedReward && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Redeem Reward</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="redemption-content">
              <div className="row">
                <div className="col-md-6">
                  <img 
                    src={selectedReward.image} 
                    alt={selectedReward.name}
                    className="redemption-image"
                  />
                </div>
                <div className="col-md-6">
                  <h4>{selectedReward.name}</h4>
                  <p className="text-muted">{selectedReward.description}</p>
                  
                  <div className="redemption-details">
                    <div className="detail-row">
                      <strong>Cost:</strong>
                      <span>
                        <FaStar className="points-star" />
                        {selectedReward.pointsCost.toLocaleString()} points
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <strong>Your Points:</strong>
                      <span>{userPoints.toLocaleString()} points</span>
                    </div>
                    
                    <div className="detail-row">
                      <strong>Remaining:</strong>
                      <span>{(userPoints - selectedReward.pointsCost).toLocaleString()} points</span>
                    </div>
                    
                    {selectedReward.carbonOffset && (
                      <div className="detail-row">
                        <strong>Environmental Impact:</strong>
                        <span>
                          <FaLeaf className="carbon-icon" />
                          Saves {selectedReward.carbonOffset}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Alert variant="info" className="mt-3">
                    <small>
                      {selectedReward.category === 'donation' 
                        ? 'Your donation will be processed within 24 hours. You will receive a confirmation email with details about the impact of your contribution.'
                        : 'Your reward will be shipped within 5-7 business days. You will receive tracking information via email.'
                      }
                    </small>
                  </Alert>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedReward(null)}>
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={() => redeemReward(selectedReward)}
              disabled={redeeming || userPoints < selectedReward.pointsCost}
            >
              {redeeming ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Redeeming...
                </>
              ) : (
                <>
                  <FaShoppingCart className="me-2" />
                  Confirm Redemption
                </>
              )}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" className="rewards-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaGift className="me-3" />
            Rewards Store
          </Modal.Title>
          <div className="user-points-display">
            <FaStar className="points-star" />
            <strong>{userPoints.toLocaleString()} points</strong>
          </div>
        </Modal.Header>
        
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-3">Loading rewards...</p>
            </div>
          ) : (
            <>
              <div className="rewards-controls mb-4">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search rewards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-md-3">
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="pointsCost">Price: Low to High</option>
                      <option value="pointsCost-desc">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                      <option value="category">Category</option>
                    </Form.Select>
                  </div>
                </div>
              </div>

              <Tabs
                activeKey={activeCategory}
                onSelect={setActiveCategory}
                className="rewards-tabs"
              >
                {getCategories().map(category => (
                  <Tab
                    key={category.key}
                    eventKey={category.key}
                    title={
                      <>
                        {category.icon}
                        <span className="ms-2">{category.label}</span>
                      </>
                    }
                  >
                    <div className="rewards-grid">
                      {filteredRewards.length > 0 ? (
                        filteredRewards.map(reward => (
                          <RewardCard key={reward.id} reward={reward} />
                        ))
                      ) : (
                        <div className="no-rewards text-center py-5">
                          <FaGift size={60} className="text-muted mb-3" />
                          <h5>No rewards found</h5>
                          <p className="text-muted">Try adjusting your search or filters</p>
                        </div>
                      )}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </>
          )}
        </Modal.Body>
      </Modal>

      <RedemptionModal />
    </>
  );
};

export default RewardsModal;