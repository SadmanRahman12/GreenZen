import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './ForumPostDetail.css'; // Create this CSS file later

const ForumPostDetail = () => {
  const { id } = useParams();
  const { userData, loading: userLoading } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/forum/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to comment.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/forum/comment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ text: newCommentText }),
      });

      if (response.ok) {
        setNewCommentText('');
        fetchPost(); // Refresh post to show new comment
      } else {
        const errorData = await response.json();
        alert(`Failed to add comment: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('An error occurred while adding the comment.');
    }
  };

  if (loading) {
    return <div className="forum-post-detail">Loading post...</div>;
  }

  if (error) {
    return <div className="forum-post-detail">Error: {error}</div>;
  }

  if (!post) {
    return <div className="forum-post-detail">Post not found.</div>;
  }

  return (
    <div className="forum-post-detail">
      <div className="post-content-section">
        <h1>{post.title}</h1>
        <p className="post-meta">By {post.authorName} on {new Date(post.date).toLocaleDateString()}</p>
        <p>{post.content}</p>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {userData && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn-primary">Submit Comment</button>
          </form>
        )}

        {post.comments.length > 0 ? (
          <div className="comment-list">
            {post.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <p className="comment-meta"><strong>{comment.userName}</strong> on {new Date(comment.date).toLocaleDateString()}</p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;
