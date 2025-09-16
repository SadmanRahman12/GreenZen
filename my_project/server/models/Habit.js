const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  carbonSaved: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastCompleted: {
    type: Date,
  },
  nextDue: {
    type: Date,
  },
});

module.exports = mongoose.model('habit', HabitSchema);
