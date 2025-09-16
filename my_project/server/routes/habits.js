const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const User = require('../models/User');

// @route   GET api/habits
// @desc    Get all habits for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching habits for user ID:', req.user.id);
    const habits = await Habit.find({ user: req.user.id });
    console.log('Habits found:', habits);
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, points, carbonSaved } = req.body;

  try {
    const newHabit = new Habit({
      name,
      description,
      points,
      carbonSaved,
      user: req.user.id,
      streak: 0, // Initialize streak
      lastCompleted: null, // Initialize lastCompleted
      nextDue: null, // Initialize nextDue
    });

    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Function to check for and award achievements
const checkAchievements = (user) => {
  const achievements = [];

  // Achievement for creating first habit
  if (user.habitsFormed === 1) {
    achievements.push({ icon: 'fas fa-seedling', label: 'Habit Starter' });
  }

  // Achievement for completing 5 habits
  if (user.habitsFormed === 5) {
    achievements.push({ icon: 'fas fa-tree', label: 'Habit Hero' });
  }

  // Achievement for reaching 100 points
  if (user.points >= 100 && user.points - user.lastPoints < 100) {
    achievements.push({ icon: 'fas fa-star', label: 'Point Collector' });
  }

  // Add new achievements to the user
  achievements.forEach(ach => {
    if (!user.achievements.some(a => a.label === ach.label)) {
      user.achievements.push(ach);
    }
  });
};


// @route   PUT api/habits/complete/:id
// @desc    Complete a habit and add points
// @access  Private
router.put('/complete/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Ensure the habit belongs to the user
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(req.user.id);
    const lastPoints = user.points;

    // Update habit fields
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize to start of today in UTC
    const lastCompletedDate = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    if (lastCompletedDate && today.toDateString() === lastCompletedDate.toDateString()) {
      // Already completed today, do nothing or return a message
      return res.status(400).json({ msg: 'Habit already completed today' });
    }

    if (lastCompletedDate && (today.getDate() - lastCompletedDate.getDate() === 1)) {
      // Completed yesterday, continue streak
      habit.streak += 1;
    } else if (lastCompletedDate && (today.getDate() - lastCompletedDate.getDate() > 1)) {
      // Missed a day, reset streak
      habit.streak = 1;
    } else {
      // First completion or completion after a reset
      habit.streak = 1;
    }

    habit.lastCompleted = today;
    // For simplicity, nextDue is just tomorrow. More complex logic might be needed for specific habit types (e.g., weekly)
    habit.nextDue = new Date(today.setDate(today.getDate() + 1));

    await habit.save();

    user.points += habit.points;
    user.habitsFormed += 1;
    user.carbonSaved += habit.carbonSaved || 0;
    user.lastPoints = lastPoints;

    user.recentActivity.unshift({
      action: `Completed '${habit.name}' and earned ${habit.points} points`,
      date: new Date().toISOString().split('T')[0],
    });

    if (user.recentActivity.length > 5) {
      user.recentActivity.pop();
    }

    checkAchievements(user);

    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
