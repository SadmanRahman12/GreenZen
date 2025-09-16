const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['global', 'regional', 'city', 'friends'],
    required: true,
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'allTime'],
    required: true,
  },
  region: {
    type: String,
    default: 'Global',
  },
  city: {
    type: String,
    default: '',
  },
  rankings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: String,
    avatar: String,
    points: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: [{
      badgeId: String,
      name: String,
      icon: String,
    }],
    rank: {
      type: Number,
      required: true,
    },
    carbonSaved: {
      type: Number,
      default: 0,
    },
    challengesCompleted: {
      type: Number,
      default: 0,
    },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
LeaderboardSchema.index({ type: 1, period: 1, region: 1, city: 1 });
LeaderboardSchema.index({ 'rankings.user': 1 });
LeaderboardSchema.index({ 'rankings.points': -1 });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);