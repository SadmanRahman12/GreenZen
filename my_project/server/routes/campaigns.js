const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const UserProgress = require('../models/UserProgress');
const Challenge = require('../models/Challenge');
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

// @route   GET /api/campaigns/active
// @desc    Get active campaigns
// @access  Private
router.get('/active', auth, async (req, res) => {
  try {
    const currentDate = new Date();
    const campaigns = await Campaign.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate('challenges');

    // Add user participation status
    const campaignsWithStatus = await Promise.all(campaigns.map(async (campaign) => {
      const isParticipating = campaign.participants.some(
        p => p.user.toString() === req.user.id
      );
      
      const participant = campaign.participants.find(
        p => p.user.toString() === req.user.id
      );

      return {
        ...campaign.toObject(),
        isParticipating,
        userProgress: participant ? participant.progress : null,
      };
    }));

    res.json(campaignsWithStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/campaigns/:id/join
// @desc    Join a campaign
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user already joined
    const alreadyJoined = campaign.participants.some(
      p => p.user.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this campaign' });
    }

    // Check if campaign is still active
    const currentDate = new Date();
    if (currentDate > campaign.endDate) {
      return res.status(400).json({ message: 'Campaign has ended' });
    }

    // Add user to participants
    campaign.participants.push({
      user: req.user.id,
      joinedAt: new Date(),
      progress: {
        completedChallenges: [],
        totalPoints: 0,
      },
    });

    await campaign.save();

    res.json({ message: 'Successfully joined campaign!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/campaigns/:id/complete-challenge
// @desc    Complete a challenge in a campaign
// @access  Private
router.post('/:id/complete-challenge', auth, async (req, res) => {
  try {
    const { challengeId } = req.body;
    const campaign = await Campaign.findById(req.params.id).populate('challenges');
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const participant = campaign.participants.find(
      p => p.user.toString() === req.user.id
    );

    if (!participant) {
      return res.status(400).json({ message: 'Not participating in this campaign' });
    }

    // Check if challenge already completed
    const alreadyCompleted = participant.progress.completedChallenges.some(
      cc => cc.challenge.toString() === challengeId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Add completed challenge
    participant.progress.completedChallenges.push({
      challenge: challengeId,
      completedAt: new Date(),
    });
    
    participant.progress.totalPoints += challenge.points;

    // Update user's overall progress
    let userProgress = await UserProgress.findOne({ user: req.user.id });
    if (!userProgress) {
      userProgress = new UserProgress({ user: req.user.id });
    }
    
    userProgress.totalPoints += challenge.points;
    userProgress.experience += challenge.points;
    
    userProgress.completedChallenges.push({
      challenge: challengeId,
      completedAt: new Date(),
      pointsEarned: challenge.points,
    });

    await Promise.all([campaign.save(), userProgress.save()]);

    res.json({
      message: 'Challenge completed successfully!',
      pointsEarned: challenge.points,
      totalCampaignPoints: participant.progress.totalPoints,
      totalUserPoints: userProgress.totalPoints,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/campaigns/upcoming
// @desc    Get upcoming campaigns
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
  try {
    const currentDate = new Date();
    const campaigns = await Campaign.find({
      isActive: true,
      startDate: { $gt: currentDate },
    }).populate('challenges');

    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/campaigns/:id/leaderboard
// @desc    Get campaign leaderboard
// @access  Private
router.get('/:id/leaderboard', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('participants.user', 'username avatar')
      .populate('challenges');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Sort participants by points
    const sortedParticipants = campaign.participants
      .sort((a, b) => b.progress.totalPoints - a.progress.totalPoints)
      .map((participant, index) => ({
        rank: index + 1,
        user: participant.user,
        points: participant.progress.totalPoints,
        challengesCompleted: participant.progress.completedChallenges.length,
        joinedAt: participant.joinedAt,
      }));

    res.json({
      campaign: {
        title: campaign.title,
        description: campaign.description,
        endDate: campaign.endDate,
      },
      leaderboard: sortedParticipants,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;