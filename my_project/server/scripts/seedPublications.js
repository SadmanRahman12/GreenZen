require('dotenv').config({ path: 'D:/GreenGen/my_project/server/.env' });
const mongoose = require('mongoose');
const Publication = require('../models/Publication');
const publicationData = require('../../src/client/publicationData').default; // Adjust path as needed

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected for seeding...');

  try {
    // Clear existing publications
    await Publication.deleteMany({});
    console.log('Existing publications cleared.');

    const publicationsToInsert = [];
    for (const category in publicationData) {
      publicationData[category].forEach(pub => {
        publicationsToInsert.push({
          title: pub.title,
          author: pub.author,
          slug: pub.slug,
          image: pub.image, // Store just the filename for now
          content: pub.content,
          category: category, // Add category from the data structure
        });
      });
    }

    await Publication.insertMany(publicationsToInsert);
    console.log('Publications seeded successfully!');
  } catch (error) {
    console.error('Error seeding publications:', error);
  } finally {
    mongoose.disconnect();
  }
})
.catch((error) => {
  console.error('MongoDB connection error for seeding:', error.message);
});