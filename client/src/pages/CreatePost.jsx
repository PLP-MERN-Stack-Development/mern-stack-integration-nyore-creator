import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import './PostForm.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      await postService.createPost(formData);
      navigate('/my-posts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
      console.error('Create post error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Post</h1>
          <p>Share your thoughts and ideas with the community</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a compelling title for your post"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your post (optional)"
            />
            <div className="char-count">
              {formData.excerpt.length}/500 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              rows="12"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write your post content here..."
            />
            <div className="char-count">
              {formData.content.length} characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
            />
            <small>Separate multiple tags with commas</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;