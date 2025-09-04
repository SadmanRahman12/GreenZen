import React from 'react';
import './CommunityForum.css';

const dummyPosts = [
  {
    id: 1,
    author: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/40?img=1',
    title: 'Tips for Reducing Your Carbon Footprint',
    snippet: 'I\'ve been making a conscious effort to reduce my carbon footprint, and I\'d love to share some tips that have worked for me...', 
    likes: 120,
    comments: 45,
  },
  {
    id: 2,
    author: 'John Smith',
    avatar: 'https://i.pravatar.cc/40?img=2',
    title: 'Favorite Eco-Friendly Brands',
    snippet: 'What are some of your favorite eco-friendly brands? I\'m looking for recommendations for everything from clothing to cleaning supplies...', 
    likes: 85,
    comments: 32,
  },
  {
    id: 3,
    author: 'Emily White',
    avatar: 'https://i.pravatar.cc/40?img=3',
    title: 'Community Garden Meetup',
    snippet: 'Our next community garden meetup is this Saturday at 10 AM. We\'ll be planting new vegetables and composting. Hope to see you there!...', 
    likes: 210,
    comments: 78,
  },
];

const CommunityForum = () => {
  return (
    <div className="community-forum">
      <div className="forum-header">
        <h1>Community Forum</h1>
        <button className="new-post-btn">New Post</button>
      </div>
      <div className="forum-search">
        <input type="text" placeholder="Search for posts..." />
      </div>
      <div className="post-list">
        {dummyPosts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img src={post.avatar} alt={`${post.author}'s avatar`} className="avatar" />
              <span className="author">{post.author}</span>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-snippet">{post.snippet}</p>
            <div className="post-stats">
              <span><i className="fas fa-heart"></i> {post.likes}</span>
              <span><i className="fas fa-comment"></i> {post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
