import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await postService.getPost(id);
      setPost(postData);
    } catch (error) {
      setError('Failed to fetch post');
      console.error('Fetch post error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="loading">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/posts" className="btn btn-primary">Back to Posts</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="container">
          <div className="error-message">Post not found</div>
          <Link to="/posts" className="btn btn-primary">Back to Posts</Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div className="post-detail-page">
      <div className="container">
        <article className="post-detail">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="author-info">
                <span className="author">By {post.author?.username || 'Unknown'}</span>
              </div>
              <div className="post-date">
                Published on {formatDate(post.createdAt)}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="post-content">
            {post.excerpt && (
              <div className="post-excerpt">
                <p>{post.excerpt}</p>
              </div>
            )}
            
            <div className="post-body">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <footer className="post-footer">
            <Link to="/posts" className="btn btn-secondary">
              Back to Posts
            </Link>
            
            {isAuthor && (
              <Link to={`/posts/edit/${post._id}`} className="btn btn-primary">
                Edit Post
              </Link>
            )}
          </footer>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;