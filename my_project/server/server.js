
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const habitRoutes = require('./routes/habits');
app.use('/api/habits', habitRoutes);

const publicationRoutes = require('./routes/publications');
app.use('/api/publications', publicationRoutes);

const externalPostsRoutes = require('./routes/externalPosts');
app.use('/api', externalPostsRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

const forumRoutes = require('./routes/forum'); // Import forum routes
app.use('/api/forum', forumRoutes); // Use forum routes

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected...');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Connection error', error.message);
});
