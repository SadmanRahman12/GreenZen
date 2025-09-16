const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserProgress = require('../models/UserProgress');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   GET /api/challenges/daily
// @desc    Get daily challenge for user
// @access  Private
router.get('/daily', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if user already has a challenge for today
    let userProgress = await UserProgress.findOne({ user: req.user.id });
    
    if (!userProgress) {
      userProgress = new UserProgress({ user: req.user.id });
      await userProgress.save();
    }

    const todayChallenge = userProgress.dailyChallenges.find(
      dc => dc.date.toDateString() === today.toDateString()
    );

    if (todayChallenge) {
      const challenge = await Challenge.findById(todayChallenge.challenge);
      return res.json({
        challenge,
        completed: todayChallenge.completed,
        completedAt: todayChallenge.completedAt,
      });
    }

    // Get a random challenge for today
    const challenges = await Challenge.find({ isActive: true });
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    // Add today's challenge to user progress
    userProgress.dailyChallenges.push({
      date: today,
      challenge: randomChallenge._id,
      completed: false,
    });
    
    await userProgress.save();

    res.json({
      challenge: randomChallenge,
      completed: false,
      completedAt: null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/challenges/daily/complete
// @desc    Mark daily challenge as complete
// @access  Private
router.post('/daily/complete', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userProgress = await UserProgress.findOne({ user: req.user.id });
    if (!userProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const todayChallenge = userProgress.dailyChallenges.find(
      dc => dc.date.toDateString() === today.toDateString()
    );

    if (!todayChallenge) {
      return res.status(404).json({ message: 'No challenge found for today' });
    }

    if (todayChallenge.completed) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    const challenge = await Challenge.findById(todayChallenge.challenge);
    
    // Mark as completed
    todayChallenge.completed = true;
    todayChallenge.completedAt = new Date();
    
    // Add points
    userProgress.totalPoints += challenge.points;
    userProgress.experience += challenge.points;
    
    // Add to completed challenges
    userProgress.completedChallenges.push({
      challenge: challenge._id,
      completedAt: new Date(),
      pointsEarned: challenge.points,
    });

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastActivity = userProgress.streaks.lastActivity;
    if (lastActivity && lastActivity.toDateString() === yesterday.toDateString()) {
      userProgress.streaks.current += 1;
    } else if (!lastActivity || lastActivity.toDateString() !== today.toDateString()) {
      userProgress.streaks.current = 1;
    }
    
    if (userProgress.streaks.current > userProgress.streaks.longest) {
      userProgress.streaks.longest = userProgress.streaks.current;
    }
    
    userProgress.streaks.lastActivity = new Date();

    // Check for level up
    const levelUpThreshold = userProgress.level * 100;
    if (userProgress.experience >= levelUpThreshold) {
      userProgress.level += 1;
      userProgress.experience = userProgress.experience - levelUpThreshold;
      userProgress.experienceToNextLevel = userProgress.level * 100;
    }

    // Check for badges
    await checkAndAwardBadges(userProgress);

    await userProgress.save();

    res.json({
      message: 'Challenge completed successfully!',
      pointsEarned: challenge.points,
      totalPoints: userProgress.totalPoints,
      level: userProgress.level,
      streak: userProgress.streaks.current,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/challenges/all
// @desc    Get all challenges
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to check and award badges
async function checkAndAwardBadges(userProgress) {
  const badges = [];

  // Streak badges
  if (userProgress.streaks.current === 7 && !userProgress.badges.some(b => b.badgeId === 'weekly_warrior')) {
    badges.push({
      badgeId: 'weekly_warrior',
      name: 'Weekly Warrior',
      description: 'Complete challenges for 7 days in a row',
      icon: 'fas fa-fire',
    });
  }

  if (userProgress.streaks.current === 30 && !userProgress.badges.some(b => b.badgeId === 'monthly_master')) {
    badges.push({
      badgeId: 'monthly_master',
      name: 'Monthly Master',
      description: 'Complete challenges for 30 days in a row',
      icon: 'fas fa-crown',
    });
  }

  // Points badges
  if (userProgress.totalPoints >= 1000 && !userProgress.badges.some(b => b.badgeId === 'eco_champion')) {
    badges.push({
      badgeId: 'eco_champion',
      name: 'Eco Champion',
      description: 'Earn 1000 eco-points',
      icon: 'fas fa-trophy',
    });
  }

  // Level badges
  if (userProgress.level >= 10 && !userProgress.badges.some(b => b.badgeId === 'green_guru')) {
    badges.push({
      badgeId: 'green_guru',
      name: 'Green Guru',
      description: 'Reach level 10',
      icon: 'fas fa-star',
    });
  }

  // Add new badges
  userProgress.badges.push(...badges);
}

module.exports = router;