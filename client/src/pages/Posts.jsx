import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import postService from '../services/postService';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts(currentPage);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('Failed to fetch posts');
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="posts-page">
        <div className="container">
          <div className="loading">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-page">
      <div className="container">
        <div className="page-header">
          <h1>All Blog Posts</h1>
          <p>Discover amazing stories and insights from our community</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="no-posts">
            <p>No posts found. Be the first to create one!</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;