import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="post-card">
      <div className="post-content">
        <h3 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>
        
        <div className="post-meta">
          <span className="author">
            By {post.author?.username || 'Unknown'}
          </span>
          <span className="date">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {post.excerpt && (
          <p className="post-excerpt">
            {truncateContent(post.excerpt)}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`/posts/${post._id}`} className="read-more">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;