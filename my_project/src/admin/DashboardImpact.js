import React from 'react';
import { FaTree, FaTint, FaRecycle, FaAward, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import './DashboardImpact.css';

const DashboardImpact = () => {
  return (
    <div className="dashboard-impact">
      <div className="impact-header">
        <h2>Your Environmental Impact</h2>
        <p>See the positive change you are making!</p>
      </div>

      {/* Impact Metrics */}
      <div className="impact-metrics">
        <div className="metric-card">
          <FaTree className="metric-icon tree" />
          <h3>Carbon Footprint Reduced</h3>
          <p className="metric-value">150 kg CO2e</p>
          <small>Equivalent to planting 2 trees</small>
        </div>
        <div className="metric-card">
          <FaTint className="metric-icon water" />
          <h3>Water Saved</h3>
          <p className="metric-value">500 Liters</p>
          <small>Enough for 1000 glasses of water</small>
        </div>
        <div className="metric-card">
          <FaRecycle className="metric-icon recycle" />
          <h3>Waste Recycled</h3>
          <p className="metric-value">25 kg</p>
          <small>Equal to 500 plastic bottles</small>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges-section">
        <h3>Your Badges</h3>
        <div className="badges-container">
          <div className="badge earned">
            <FaLeaf className="badge-icon" />
            <p>Eco Starter</p>
          </div>
          <div className="badge earned">
            <FaShieldAlt className="badge-icon" />
            <p>Energy Saver</p>
          </div>
          <div className="badge">
            <FaAward className="badge-icon" />
            <p>Recycling Master</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <h3>Next Goal: Water Warrior</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{width: '60%'}}></div>
        </div>
        <p>You are 60% of the way to saving 1000L of water!</p>
      </div>
    </div>
  );
};

export default DashboardImpact;