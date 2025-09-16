require('dotenv').config({ path: 'D:/GreenGen/my_project/server/.env' });
const mongoose = require('mongoose');
const ForumPost = require('../models/ForumPost');
const User = require('../models/User'); // Assuming User model is available

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected for seeding forum posts...');

  try {
    // Find an existing user or create a dummy one
    let user = await User.findOne();
    if (!user) {
      console.log('No existing user found. Creating a dummy user for seeding.');
      user = new User({
        name: 'SeederUser', // Use 'name' instead of 'username'
        email: 'seeder@example.com',
        password: 'password123', // This will be hashed by pre-save hook if defined in User model
        // Add any other required fields for your User model
      });
      await user.save();
      console.log('Dummy user created:', user.name); // Use 'name' here too
    }

    // Clear existing forum posts
    await ForumPost.deleteMany({});
    console.log('Existing forum posts cleared.');

    const samplePosts = [
      {
        title: 'Welcome to the GreenZen Forum!',
        content: 'This is the first post in our community forum. Feel free to introduce yourself and share your thoughts on environmental sustainability.',
        author: user._id,
        authorName: user.name, // Use 'name' instead of 'username'
      },
      {
        title: 'Tips for Reducing Your Carbon Footprint',
        content: 'I\'ve been trying to reduce my carbon footprint lately. Here are a few tips that have worked for me: 1. Use public transport or bike. 2. Reduce meat consumption. 3. Unplug electronics when not in use. What are your tips?',
        author: user._id,
        authorName: user.name, // Use 'name' instead of 'username'
      },
      {
        title: 'Upcoming Green Events in My City',
        content: 'Just found out about a local park cleanup event next Saturday! Anyone else planning to go? Let\'s make a difference together!',
        author: user._id,
        authorName: user.name, // Use 'name' instead of 'username'
      },
      {
        title: 'Question about Composting',
        content: 'I\'m new to composting and have a few questions. What\'s the best way to start a compost pile? Any tips for beginners?',
        author: user._id,
        authorName: user.name, // Use 'name' instead of 'username'
      },
      {
        title: 'Sharing My Sustainable Living Journey',
        content: 'It\'s been a year since I started my sustainable living journey. I\'ve learned so much and made many changes. Happy to share my experiences and answer any questions!',
        author: user._id,
        authorName: user.name, // Use 'name' instead of 'username'
      },
    ];

    await ForumPost.insertMany(samplePosts);
    console.log('Forum posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding forum posts:', error);
  } finally {
    mongoose.disconnect();
  }
})
.catch((error) => {
  console.error('MongoDB connection error for seeding:', error.message);
});
