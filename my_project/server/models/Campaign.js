const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'event'],
    required: true,
  },
  duration: {
    type: Number, // Duration in days
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  challenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      completedChallenges: [{
        challenge: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Challenge',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      }],
      totalPoints: {
        type: Number,
        default: 0,
      },
    },
  }],
  rewards: {
    first: {
      points: Number,
      badge: String,
      description: String,
    },
    second: {
      points: Number,
      badge: String,
      description: String,
    },
    third: {
      points: Number,
      badge: String,
      description: String,
    },
    participation: {
      points: Number,
      badge: String,
      description: String,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  banner: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['earth-day', 'world-environment-day', 'zero-emissions-day', 'custom'],
    default: 'custom',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Campaign', CampaignSchema);