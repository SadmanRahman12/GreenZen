import React, { useState, useEffect, useContext } from 'react';
import { useDashboard } from './Dashboard';
import { ThemeContext } from '../context/ThemeContext';
import './HabitTracker.css';

const HabitTracker = () => {
  const { theme } = useContext(ThemeContext);
  const { fetchUserData } = useDashboard();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', points: 10, carbonSaved: 1 });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/habits', {
        headers: {
          'x-auth-token': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      } else {
        console.error('Failed to fetch habits');
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You are not logged in. Please log in to add habits.');
        return;
      }
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newHabit),
      });
      if (response.ok) {
        fetchHabits();
        setNewHabit({ name: '', description: '', points: 10, carbonSaved: 1 });
        alert('Habit created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to create habit:', response.status, errorData);
        alert(`Failed to create habit: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/habits/complete/${id}`,
        {
          method: 'PUT',
          headers: {
            'x-auth-token': token,
          },
        }
      );
      if (response.ok) {
        fetchHabits();
        fetchUserData(); // Refresh user data after completing a habit
      } else {
        console.error('Failed to complete habit');
      }
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const completedHabits = habits.filter(habit => habit.lastCompleted !== null);
  const totalPoints = completedHabits.reduce((acc, habit) => acc + habit.points, 0);
  const totalCarbonSaved = completedHabits.reduce((acc, habit) => acc + habit.carbonSaved, 0);
  const habitsFormedCount = completedHabits.length;

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className={`habit-tracker-container ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="habit-tracker-header">
        <h1>Habit Tracker</h1>
        <p>Cultivate a greener lifestyle, one habit at a time.</p>
      </header>

      <div className="habit-summary-cards">
        <div className="summary-card">
          <i className="fas fa-star"></i>
          <h3>Total Points</h3>
          <p>{totalPoints}</p>
        </div>
        <div className="summary-card">
          <i className="fas fa-leaf"></i>
          <h3>Carbon Saved (kg)</h3>
          <p>{totalCarbonSaved}</p>
        </div>
        <div className="summary-card">
          <i className="fas fa-check-circle"></i>
          <h3>Habits Formed</h3>
          <p>{habitsFormedCount}</p>
        </div>
      </div>

      <div className="add-habit-card">
        <h3><i className="fas fa-plus-circle"></i> Add a New Habit</h3>
        <form onSubmit={handleSubmit} className="add-habit-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={newHabit.name}
              onChange={handleInputChange}
              placeholder="e.g., Use a reusable water bottle"
              required
            />
            <textarea
              name="description"
              value={newHabit.description}
              onChange={handleInputChange}
              placeholder="A brief description of the habit"
              required
            ></textarea>
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label>Points</label>
              <input
                type="number"
                name="points"
                value={newHabit.points}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Carbon Saved (kg)</label>
              <input
                type="number"
                name="carbonSaved"
                value={newHabit.carbonSaved}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button type="submit" className="add-habit-btn">Add Habit</button>
        </form>
      </div>

      <div className="habits-list">
        <h3><i className="fas fa-list-alt"></i> Your Habits</h3>
        {habits.length > 0 ? (
          habits.map((habit) => (
            <div key={habit._id} className={`habit-item-card ${habit.lastCompleted && isToday(new Date(habit.lastCompleted)) ? 'completed-today' : ''}`}>
              <div className="habit-info">
                <h4>{habit.name}</h4>
                <p>{habit.description}</p>
                <div className="habit-rewards">
                  <span><i className="fas fa-star"></i> {habit.points} Points</span>
                  <span><i className="fas fa-leaf"></i> {habit.carbonSaved} kg CO₂</span>
                </div>
                <div className="habit-meta">
                  {habit.streak > 0 && <span><i className="fas fa-fire"></i> Streak: {habit.streak} days</span>}
                  {habit.lastCompleted && <span>Last Completed: {new Date(habit.lastCompleted).toLocaleDateString()}</span>}
                  {habit.nextDue && <span>Next Due: {new Date(habit.nextDue).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="habit-actions">
                <button onClick={() => handleComplete(habit._id)} className="complete-btn" disabled={habit.lastCompleted && isToday(new Date(habit.lastCompleted))}>
                  <i className="fas fa-check"></i> {habit.lastCompleted && isToday(new Date(habit.lastCompleted)) ? 'Completed' : 'Complete'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-habits-message">You haven't added any habits yet. Start by adding one above!</p>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
