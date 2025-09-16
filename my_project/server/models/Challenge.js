const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['energy', 'transport', 'waste', 'water', 'food', 'general'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  icon: {
    type: String,
    default: 'fas fa-leaf',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Challenge', ChallengeSchema);