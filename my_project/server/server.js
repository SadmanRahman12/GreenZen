
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

const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);

const habitsRoutes = require('./routes/habits');
app.use('/api/habits', habitsRoutes);

const publicationsRoutes = require('./routes/publications');
app.use('/api/publications', publicationsRoutes);

const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);

const externalPostsRoutes = require('./routes/externalPosts');
app.use('/api/external-posts', externalPostsRoutes);

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
