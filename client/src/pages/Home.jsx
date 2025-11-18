import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Kayoni Graphics</h1>
          <p>Your home of graphics, printing and branding</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <Link to="/posts/create" className="btn btn-primary">
                  Make your order
                </Link>
                <Link to="/posts" className="btn btn-secondary">
                  Explore Order
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/posts" className="btn btn-secondary">
                  Read Posts
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why shop with Kayoni Graphics?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Graphics</h3>
              <p>We design logos, flairs, businness cards, artworks, banners, posters, and many more.</p>
            </div>
            <div className="feature-card">
              <h3>Branding</h3>
              <p>We brand t-shirts, reflectors, caps, mugs, jerseys e.t.c</p>
            </div>
            <div className="feature-card">
              <h3>Printing</h3>
              <p>We do bulk printing, large format printing, embroidery, receipt books, eulogies, delivery notebooks, invoice books among others.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;