const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User');

// @route   GET api/forum
// @desc    Get all forum posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Get limit from query parameter
    let query = ForumPost.find().sort({ date: -1 });

    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }

    const posts = await query;
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/forum/:id
// @desc    Get single forum post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/forum
// @desc    Create a forum post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new ForumPost({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      authorName: user.username, // Assuming user has a username field
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/:id
// @desc    Update a forum post
// @access  Private (only author can update)
router.put('/:id', auth, async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { title, content } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/forum/:id
// @desc    Delete a forum post
// @access  Private (only author or admin can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const user = await User.findById(req.user.id);

    // Check user or if admin
    if (post.author.toString() !== req.user.id && !user.isAdmin) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await ForumPost.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/forum/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await ForumPost.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      userName: user.username, // Assuming user has a username field
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/forum/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    // Check if the post has already been liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/forum/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    // Check if the post has not yet been liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
