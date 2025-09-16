

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/user/settings
// @desc    Get user settings
// @access  Private
router.get('/settings', (req, res) => {
  // Placeholder for fetching user settings
  res.json({ notifications: { email: true, push: true }, theme: 'light' });
});

// @route   PUT api/user/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  const { name, email, settings } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.settings = settings || user.settings;

    await user.save();

    res.json({ msg: 'Settings updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/user/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   GET api/user/all
// @desc    Get all users
// @access  Private (Admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/user/toggle-admin/:id
// @desc    Toggle a user's admin status
// @access  Private (Admin)
router.put('/toggle-admin/:id', adminAuth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ msg: `User ${user.email} admin status toggled to ${user.isAdmin}.`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/user/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

