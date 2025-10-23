import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import './PostForm.css';

const EditPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    isPublished: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPost();
  }, [id, isAuthenticated, navigate]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postData = await postService.getPost(id);
      
      // Check if current user is the author
      if (!postData.author || postData.author._id !== user?._id) {
        setError('You are not authorized to edit this post');
        return;
      }

      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        tags: postData.tags ? postData.tags.join(', ') : '',
        isPublished: postData.isPublished || true
      });
    } catch (error) {
      setError('Failed to fetch post');
      console.error('Fetch post error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      await postService.updatePost(id, formData);
      navigate('/my-posts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post');
      console.error('Update post error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="post-form-page">
        <div className="container">
          <div className="loading">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="post-form-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/my-posts')} className="btn btn-primary">
            Back to My Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Post</h1>
          <p>Update your blog post</p>
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

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />
              Publish this post
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;