import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <header className="navbar">
        <div className="logo">Central Library</div>
        <nav className="nav-menu">
            <Link to="/" className="active">Home</Link>
            <a href="#">About</a>
            <a href="#">Catalog</a>
            <a href="#">Contact</a>
            <Link to="/login" className="btn-primary">Login / Sign Up</Link>
        </nav>
      </header>

      <main className="landing-hero">
          <div className="hero-content">
              <h1>Your Gateway to Knowledge</h1>
              <p>Access thousands of books, journals, and digital resources. A simple, basic, yet clean interface for our
                  college students and administration.</p>
              <div className="hero-buttons">
                  <Link to="/login" className="btn-primary btn-large">Get Started</Link>
                  <a href="#features" className="btn-outline btn-large">Learn More</a>
              </div>
          </div>
      </main>

      <section id="features" className="features-section">
          <div className="feature-card">
              <h3>Vast Collection</h3>
              <p>Thousands of academic books and resources at your fingertips.</p>
          </div>
          <div className="feature-card">
              <h3>Easy Tracking</h3>
              <p>Keep track of borrowed books and their due dates easily.</p>
          </div>
          <div className="feature-card">
              <h3>Admin Portal</h3>
              <p>Dedicated administration tools to manage the library inventory.</p>
          </div>
      </section>

      <footer className="basic-footer">
          <p>&copy; 2024 College Central Library Project. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Landing;
