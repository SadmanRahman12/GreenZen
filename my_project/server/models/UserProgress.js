const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  experienceToNextLevel: {
    type: Number,
    default: 100,
  },
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  completedChallenges: [{
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    pointsEarned: Number,
  }],
  dailyChallenges: [{
    date: {
      type: Date,
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  }],
  streaks: {
    current: {
      type: Number,
      default: 0,
    },
    longest: {
      type: Number,
      default: 0,
    },
    lastActivity: Date,
  },
  monthlyStats: [{
    month: {
      type: String, // Format: "2025-09"
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    challengesCompleted: {
      type: Number,
      default: 0,
    },
    carbonSaved: {
      type: Number,
      default: 0,
    },
  }],
  region: {
    type: String,
    default: 'Global',
  },
  city: {
    type: String,
    default: '',
  },
  friends: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  ecoBattles: [{
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    myPoints: {
      type: Number,
      default: 0,
    },
    opponentPoints: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUpdated on save
UserProgressSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);