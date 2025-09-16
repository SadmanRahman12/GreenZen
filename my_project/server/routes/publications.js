const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Publication = require('../models/Publication');

// Get all publications
router.get('/', async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single publication by slug
router.get('/:slug', async (req, res) => {
  try {
    const publication = await Publication.findOne({ slug: req.params.slug });
    res.json(publication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/publications
// @desc    Create a publication
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  const { title, author, content, imageUrl, tags, slug } = req.body;

  try {
    const newPublication = new Publication({
      title,
      author,
      content,
      imageUrl,
      tags,
      slug,
    });

    const publication = await newPublication.save();
    res.status(201).json(publication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/publications/:id
// @desc    Update a publication
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  const { title, author, content, imageUrl, tags, slug } = req.body;

  // Build publication object
  const publicationFields = {};
  if (title) publicationFields.title = title;
  if (author) publicationFields.author = author;
  if (content) publicationFields.content = content;
  if (imageUrl) publicationFields.imageUrl = imageUrl;
  if (tags) publicationFields.tags = tags;
  if (slug) publicationFields.slug = slug;

  try {
    let publication = await Publication.findById(req.params.id);

    if (!publication) return res.status(404).json({ msg: 'Publication not found' });

    publication = await Publication.findByIdAndUpdate(
      req.params.id,
      { $set: publicationFields },
      { new: true }
    );

    res.json(publication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/publications/:id
// @desc    Delete a publication
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) return res.status(404).json({ msg: 'Publication not found' });

    await Publication.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Publication removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;