import React, { useContext } from 'react';
import { FaTree, FaTint, FaRecycle, FaAward, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { useDashboard } from './Dashboard'; // Assuming useDashboard provides user data
import './DashboardImpact.css';

const DashboardImpact = () => {
  const { theme } = useContext(ThemeContext);
  const { userData } = useDashboard(); // Get user data from the dashboard context

  // Default values if userData is not yet loaded or properties are missing
  const totalCarbonSaved = userData?.carbonSaved || 0;
  const totalPoints = userData?.points || 0;
  const habitsFormed = userData?.habitsFormed || 0;
  const achievements = userData?.achievements || [];

  // Placeholder for water saved and waste recycled, as these are not directly in userData
  // These would ideally come from more detailed habit tracking or external integrations
  const waterSaved = (totalCarbonSaved * 3).toFixed(0); // Example: 1kg CO2e ~ 3L water saved
  const wasteRecycled = (totalCarbonSaved * 0.5).toFixed(0); // Example: 1kg CO2e ~ 0.5kg waste recycled

  return (
    <div className={`dashboard-impact-container ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="impact-header">
        <h2>Your Environmental Impact</h2>
        <p>See the positive change you are making!</p>
      </div>

      {/* Impact Metrics */}
      <div className="impact-metrics">
        <div className="metric-card">
          <FaTree className="metric-icon tree" />
          <h3>Carbon Footprint Reduced</h3>
          <p className="metric-value">{totalCarbonSaved} kg CO2e</p>
          <small>Equivalent to planting {(totalCarbonSaved / 6).toFixed(0)} trees</small> {/* Approx 6kg CO2e per tree */}
        </div>
        <div className="metric-card">
          <FaTint className="metric-icon water" />
          <h3>Water Saved</h3>
          <p className="metric-value">{waterSaved} Liters</p>
          <small>Enough for {(waterSaved / 0.5).toFixed(0)} glasses of water</small> {/* Approx 0.5L per glass */}
        </div>
        <div className="metric-card">
          <FaRecycle className="metric-icon recycle" />
          <h3>Habits Formed</h3>
          <p className="metric-value">{habitsFormed}</p>
          <small>Total eco-friendly actions</small>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges-section">
        <h3>Your Badges</h3>
        <div className="badges-container">
          {achievements.length > 0 ? (
            achievements.map((badge, index) => (
              <div key={index} className="badge earned">
                <i className={badge.icon}></i> {/* Assuming badge.icon is a Font Awesome class */} 
                <p>{badge.label}</p>
              </div>
            ))
          ) : (
            <p className="no-badges-message">No badges earned yet. Keep up the great work!</p>
          )}
        </div>
      </div>

      {/* Progress Section - Example based on total points */}
      <div className="progress-section">
        <h3>Total Points: {totalPoints}</h3>
        <p>Keep earning points to unlock new achievements!</p>
      </div>
    </div>
  );
};

export default DashboardImpact;
