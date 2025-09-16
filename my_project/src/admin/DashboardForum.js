import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './DashboardForum.css';

const DashboardForum = () => {
  const { theme } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExternalPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/external-posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map external posts to a forum-like structure
        const formattedPosts = data.map(article => ({
          id: article.id,
          author: article.author || 'Unknown',
          avatar: article.avatar || 'https://i.pravatar.cc/40?img=' + Math.floor(Math.random() * 70),
          title: article.title,
          snippet: article.snippet,
          likes: article.likes || 0,
          comments: article.comments || 0,
          publishedAt: article.publishedAt,
          url: article.url,
        }));
        setPosts(formattedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalPosts();
  }, []);

  if (loading) {
    return <div className={`dashboard-forum-container ${theme === 'dark' ? 'dark' : ''}`}>Loading forum content...</div>;
  }

  if (error) {
    return <div className={`dashboard-forum-container ${theme === 'dark' ? 'dark' : ''}`}>Error: {error}</div>;
  }

  return (
    <div className={`dashboard-forum-container ${theme === 'dark' ? 'dark' : ''}`}>
      <h2 className="forum-header">Community Forum (External Posts)</h2>
      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.avatar} alt={`${post.author}'s avatar`} className="avatar" />
                <span className="author">{post.author}</span>
                <span className="post-date">{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="post-title"><a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a></h3>
              <p className="post-snippet">{post.snippet}</p>
              <div className="post-stats">
                <span><i className="fas fa-heart"></i> {post.likes}</span>
                <span><i className="fas fa-comment"></i> {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-posts-message">No forum posts available at the moment.</p>
      )}
    </div>
  );
};

export default DashboardForum;