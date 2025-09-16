import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { UserContext } from '../context/UserContext';
import './CommunityForum.css';

const CommunityForum = () => {
  const { userData, loading: userLoading } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
  });

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPostData({ ...newPostData, [name]: value });
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to create a post.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newPostData),
      });

      if (response.ok) {
        alert('Post created successfully!');
        setNewPostData({ title: '', content: '' });
        setShowNewPostForm(false);
        fetchPosts(); // Refresh posts
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert('An error occurred while creating the post.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to like a post.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/forum/like/${postId}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const updatedLikes = await response.json(); // Await the response
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        ));
      } else {
        const errorData = await response.json();
        alert(`Failed to like post: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('An error occurred while liking the post.');
    }
  };

  const fetchPosts = async () => {
    console.log('Attempting to fetch posts...');
    try {
      const response = await fetch('http://localhost:5000/api/forum');
      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('CommunityForum useEffect triggered.');
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="community-forum">Loading posts...</div>;
  }

  if (error) {
    return <div className="community-forum">Error: {error}</div>;
  }

  return (
    <div className="community-forum">
      <div className="forum-header">
        <h1>Community Forum</h1>
        {userData && ( // Only show New Post button if user is logged in
          <button className="new-post-btn" onClick={() => setShowNewPostForm(!showNewPostForm)}>
            {showNewPostForm ? 'Cancel Post' : 'New Post'}
          </button>
        )}
      </div>
      {showNewPostForm && userData && ( // Only show form if user is logged in and button is clicked
        <div className="new-post-form-container">
          <h2>Create New Post</h2>
          <form onSubmit={handleNewPostSubmit} className="new-post-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={newPostData.title}
                onChange={handleNewPostChange}
                placeholder="Post Title"
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                name="content"
                value={newPostData.content}
                onChange={handleNewPostChange}
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary">Submit Post</button>
          </form>
        </div>
      )}
      <div className="forum-search">
        <input type="text" placeholder="Search for posts..." />
      </div>
      <div className="post-list">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <Link to={`/forum/${post._id}`} className="post-link"> {/* Add Link to post detail page */}
              <div className="post-header">
                {/* Assuming authorName is available from backend */}
                <span className="author">{post.authorName}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-snippet">{post.content.substring(0, 150)}...</p> {/* Display snippet of content */}
            </Link>
            <div className="post-stats">
              <button
                className={`like-button ${userData && post.likes.some(like => like.user === userData._id) ? 'liked' : ''}`}
                onClick={() => handleLike(post._id)}
                disabled={!userData} // Disable if not logged in
              >
                <i className="fas fa-heart"></i> {post.likes.length}
              </button>
              <span><i className="fas fa-comment"></i> {post.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
