const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  carbonSaved: {
    type: Number,
    default: 0,
  },
  habitsFormed: {
    type: Number,
    default: 0,
  },
  communityPoints: {
    type: Number,
    default: 0,
  },
  achievements: {
    type: [
      {
        icon: String,
        label: String,
      },
    ],
    default: [],
  },
  recentActivity: {
    type: [
      {
        action: String,
        date: Date,
      },
      ],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('user', UserSchema);