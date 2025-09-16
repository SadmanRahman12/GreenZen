import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ModuleDetail = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/education/modules/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch module details: ${response.statusText}`);
        }
        const data = await response.json();
        setModule(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [id]);

  const handleMarkAsCompleted = async () => {
    try {
      // In a real application, you would send an API request to update user progress
      // For now, we'll just update the local state
      setModule(prevModule => ({
        ...prevModule,
        progress: 100,
        isCompleted: true,
      }));
      alert('Module marked as completed!');
    } catch (err) {
      console.error('Error marking module as completed:', err);
      alert('Failed to mark module as completed.');
    }
  };

  if (loading) {
    return <div className="module-detail-page">Loading module details...</div>;
  }

  if (error) {
    return <div className="module-detail-page">Error: {error}</div>;
  }

  if (!module) {
    return <div className="module-detail-page">Module not found.</div>;
  }

  return (
    <div className="module-detail-page">
      <div className="module-header">
        <h2>{module.title}</h2>
        <p className="module-category">Category: {module.category}</p>
        <p className="module-difficulty">Difficulty: {module.difficulty}</p>
      </div>

      <div className="module-content">
        <p>{module.description}</p>
        {/* Assuming module.fullContent exists for detailed text */}
        <div className="full-content">
          {module.fullContent || 'No detailed content available for this module yet.'}
        </div>
      </div>

      <div className="module-progress-section">
        <h3>Your Progress</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${module.progress}%` }}>
            {module.progress}%
          </div>
        </div>
        {!module.isCompleted && module.progress < 100 && (
          <button onClick={handleMarkAsCompleted} className="btn-primary">
            Mark as Completed
          </button>
        )}
        {module.isCompleted && (
          <p className="completed-message">&#10003; Module Completed!</p>
        )}
      </div>

      {/* Placeholder for Gamification Elements */}
      <div className="module-gamification">
        <h3>Achievements & Rewards</h3>
        <p>Complete this module to earn <strong>50 Green Points</strong> and the <strong>'Eco-Learner'</strong> badge!</p>
      </div>

      {/* Placeholder for Next/Previous Navigation */}
      <div className="module-navigation">
        <button className="btn-secondary">Previous Module</button>
        <button className="btn-primary">Next Module</button>
      </div>
    </div>
  );
};

export default ModuleDetail;