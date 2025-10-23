import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyPosts();
  }, [isAuthenticated, navigate]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const postsData = await postService.getUserPosts();
      setPosts(postsData);
    } catch (error) {
      setError('Failed to fetch your posts');
      console.error('Fetch my posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (error) {
        setError('Failed to delete post');
        console.error('Delete post error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="my-posts-page">
        <div className="container">
          <div className="loading">Loading your posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="page-header">
          <h1>My Posts</h1>
          <p>Manage your blog posts</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="posts-actions">
          <Link to="/posts/create" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>You haven't created any posts yet.</p>
            <Link to="/posts/create" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td className="post-title">
                      <Link to={`/posts/${post._id}`}>
                        {post.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`status ${post.isPublished ? 'published' : 'draft'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="post-date">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="post-actions">
                      <Link 
                        to={`/posts/${post._id}`} 
                        className="btn btn-sm btn-view"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/posts/edit/${post._id}`} 
                        className="btn btn-sm btn-edit"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-sm btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;