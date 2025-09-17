const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('User:', req.user);
  const { title, date, time, location, description, image } = req.body;

  try {
    const newEvent = new Event({
      title,
      date,
      time,
      location,
      description,
      image,
      user: req.user.id,
    });

    const event = await newEvent.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  const { title, date, time, location, description, image } = req.body;

  // Build event object
  const eventFields = {};
  if (title) eventFields.title = title;
  if (date) eventFields.date = date;
  if (time) eventFields.time = time;
  if (location) eventFields.location = location;
  if (description) eventFields.description = description;
  if (image) eventFields.image = image;

  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Ensure user is admin
    // The adminAuth middleware already handles this, but an extra check doesn't hurt
    // if (event.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Ensure user is admin
    // The adminAuth middleware already handles this
    // if (event.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' });
    // }

    await Event.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
