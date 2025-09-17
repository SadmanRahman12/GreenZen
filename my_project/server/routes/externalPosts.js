const express = require('express');
const router = express.Router();
const axios = require('axios'); // Need to install axios: npm install axios

// This route fetches external news articles
router.get('/', async (req, res) => {
  try {
    // Replace 'YOUR_NEWS_API_KEY' with an actual API key from a news API provider (e.g., NewsAPI.org, GNews)
    // You might need to register for a free API key.
    const NEWS_API_KEY = process.env.NEWS_API_KEY || 'cc7fef7244f74cde9a0d43dc1c25f29a'; // NewsAPI.org key
    const query = req.query.q || 'environment'; // Re-inserting query definition with a simpler default
    const pageSize = req.query.pageSize || 10; // Re-inserting pageSize definition
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`; // NewsAPI.org URL

    const response = await axios.get(newsApiUrl);
    const articles = response.data.articles.map(article => ({
      id: article.url, // Use URL as a unique ID
      author: article.author || article.source.name || 'Unknown',
      avatar: 'https://i.pravatar.cc/40?img=' + Math.floor(Math.random() * 70),
      title: article.title,
      snippet: article.description || article.content || 'No description available.',
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100),
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      image: article.urlToImage,
      // Added placeholder/derived fields for DashboardForum.js compatibility
      date: new Date(article.publishedAt).toISOString().split('T')[0], // Format date
      category: 'General', // Default category
      tags: article.title ? article.title.toLowerCase().split(' ').filter(tag => tag.length > 3 && Math.random() > 0.5) : [], // Derive some tags from title
      isFeatured: Math.random() > 0.7, // Randomly feature some posts
      rank: 'Newbie', // Default rank
    }));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching external posts:', error.message);
    if (error.response) {
      console.error('News API response error:', error.response.data);
      return res.status(error.response.status).json({ msg: 'Error from external news API', details: error.response.data });
    }
    res.status(500).json({ msg: 'Server error fetching external posts' });
  }
});

module.exports = router;