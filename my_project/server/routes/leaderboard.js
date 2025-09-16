const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
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

// @route   GET /api/leaderboard/global
// @desc    Get global leaderboard
// @access  Private
router.get('/global', auth, async (req, res) => {
  try {
    const { period = 'allTime', limit = 50 } = req.query;
    
    let matchQuery = {};
    
    // Filter by time period
    if (period !== 'allTime') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'daily':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      matchQuery.lastUpdated = { $gte: startDate };
    }

    const leaderboard = await UserProgress.find(matchQuery)
      .populate('user', 'username avatar')
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit));

    const formattedLeaderboard = leaderboard.map((progress, index) => ({
      rank: index + 1,
      user: {
        id: progress.user._id,
        username: progress.user.username,
        avatar: progress.user.avatar,
      },
      points: progress.totalPoints,
      level: progress.level,
      badges: progress.badges.slice(0, 3), // Show top 3 badges
      challengesCompleted: progress.completedChallenges.length,
      streak: progress.streaks.current,
      carbonSaved: Math.floor(progress.totalPoints * 0.1), // Estimate carbon saved
    }));

    // Find current user's rank
    const currentUserProgress = await UserProgress.findOne({ user: req.user.id });
    let currentUserRank = null;
    
    if (currentUserProgress) {
      const betterUsers = await UserProgress.countDocuments({
        totalPoints: { $gt: currentUserProgress.totalPoints }
      });
      currentUserRank = betterUsers + 1;
    }

    res.json({
      leaderboard: formattedLeaderboard,
      currentUser: {
        rank: currentUserRank,
        points: currentUserProgress ? currentUserProgress.totalPoints : 0,
        level: currentUserProgress ? currentUserProgress.level : 1,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/leaderboard/friends
// @desc    Get friends leaderboard
// @access  Private
router.get('/friends', auth, async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ user: req.user.id });
    if (!userProgress || !userProgress.friends.length) {
      return res.json({ leaderboard: [], message: 'No friends found' });
    }

    const friendIds = userProgress.friends.map(friend => friend.user);
    friendIds.push(req.user.id); // Include current user

    const friendsProgress = await UserProgress.find({ user: { $in: friendIds } })
      .populate('user', 'username avatar')
      .sort({ totalPoints: -1 });

    const formattedLeaderboard = friendsProgress.map((progress, index) => ({
      rank: index + 1,
      user: {
        id: progress.user._id,
        username: progress.user.username,
        avatar: progress.user.avatar,
      },
      points: progress.totalPoints,
      level: progress.level,
      badges: progress.badges.slice(0, 3),
      challengesCompleted: progress.completedChallenges.length,
      streak: progress.streaks.current,
      isCurrentUser: progress.user._id.toString() === req.user.id,
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/leaderboard/regional
// @desc    Get regional leaderboard
// @access  Private
router.get('/regional', auth, async (req, res) => {
  try {
    const { region, city } = req.query;
    let matchQuery = {};

    if (city) {
      matchQuery.city = city;
    } else if (region) {
      matchQuery.region = region;
    }

    const leaderboard = await UserProgress.find(matchQuery)
      .populate('user', 'username avatar')
      .sort({ totalPoints: -1 })
      .limit(50);

    const formattedLeaderboard = leaderboard.map((progress, index) => ({
      rank: index + 1,
      user: {
        id: progress.user._id,
        username: progress.user.username,
        avatar: progress.user.avatar,
      },
      points: progress.totalPoints,
      level: progress.level,
      region: progress.region,
      city: progress.city,
      challengesCompleted: progress.completedChallenges.length,
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/leaderboard/eco-battle/create
// @desc    Create eco-battle with friend
// @access  Private
router.post('/eco-battle/create', auth, async (req, res) => {
  try {
    const { friendId, duration = 7 } = req.body;

    const userProgress = await UserProgress.findOne({ user: req.user.id });
    const friendProgress = await UserProgress.findOne({ user: friendId });

    if (!friendProgress) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    // Create battle for current user
    userProgress.ecoBattles.push({
      opponent: friendId,
      startDate,
      endDate,
      myPoints: 0,
      opponentPoints: 0,
      status: 'active',
    });

    // Create battle for friend
    friendProgress.ecoBattles.push({
      opponent: req.user.id,
      startDate,
      endDate,
      myPoints: 0,
      opponentPoints: 0,
      status: 'active',
    });

    await Promise.all([userProgress.save(), friendProgress.save()]);

    res.json({ message: 'Eco-battle created successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/leaderboard/eco-battles
// @desc    Get user's eco-battles
// @access  Private
router.get('/eco-battles', auth, async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ user: req.user.id })
      .populate('ecoBattles.opponent', 'username avatar');

    if (!userProgress || !userProgress.ecoBattles.length) {
      return res.json({ battles: [] });
    }

    const battles = userProgress.ecoBattles.map(battle => ({
      id: battle._id,
      opponent: battle.opponent,
      startDate: battle.startDate,
      endDate: battle.endDate,
      myPoints: battle.myPoints,
      opponentPoints: battle.opponentPoints,
      status: battle.status,
      winner: battle.winner,
      daysRemaining: Math.max(0, Math.ceil((battle.endDate - new Date()) / (1000 * 60 * 60 * 24))),
    }));

    res.json({ battles });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/leaderboard/add-friend
// @desc    Add friend
// @access  Private
router.post('/add-friend', auth, async (req, res) => {
  try {
    const { friendUsername } = req.body;

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (friend._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    const userProgress = await UserProgress.findOne({ user: req.user.id });
    const friendProgress = await UserProgress.findOne({ user: friend._id });

    // Check if already friends
    const alreadyFriends = userProgress.friends.some(
      f => f.user.toString() === friend._id.toString()
    );

    if (alreadyFriends) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Add to both users' friend lists
    userProgress.friends.push({ user: friend._id });
    friendProgress.friends.push({ user: req.user.id });

    await Promise.all([userProgress.save(), friendProgress.save()]);

    res.json({ message: 'Friend added successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;