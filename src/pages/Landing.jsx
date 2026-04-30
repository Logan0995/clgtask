import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { BookOpen, CheckSquare, Shield, Activity, ArrowRight, Library, Users, FileText } from 'lucide-react';

const Landing = () => {
  const { books, members, issueRequests } = useContext(StoreContext);

  // Showcase books filtering
  const showcaseBooks = books.filter(b => 
    b.title.toLowerCase().includes('pride and prejudice') || 
    b.title.toLowerCase().includes('why i am an athiest')
  ).slice(0, 4);

  // Fallback to first 2 if specific books not found
  const displayBooks = showcaseBooks.length > 0 ? showcaseBooks : books.slice(0, 4);

  return (
    <>
      <header className="navbar">
        <div className="logo">
            <Library size={24} color="var(--primary)" />
            <span>Central Library</span>
        </div>
        <nav className="nav-menu">
            <Link to="/" className="active">Home</Link>
            <a href="#features">Features</a>
            <a href="#showcase">Catalog</a>
            <a href="#preview">System</a>
            <Link to="/login" className="btn-primary" style={{ marginLeft: '1.5rem' }}>Login / Sign Up</Link>
        </nav>
      </header>

      <main className="landing-hero" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
          <div className="hero-content">
              <h1>Smart Library <span>Management System</span></h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '3rem' }}>
                  Manage books, members, and requests seamlessly with our premium, modern SaaS platform designed for high-performance administration.
              </p>
              <div className="hero-buttons">
                  <Link to="/login" className="btn-primary btn-large" style={{ gap: '0.5rem' }}>
                      Login <ArrowRight size={18} />
                  </Link>
                  <Link to="/login" state={{ isSignup: true }} className="btn-outline btn-large">
                      Sign Up
                  </Link>
                  <a href="#showcase" className="btn-outline btn-large" style={{ border: '1px solid transparent', color: 'var(--text-muted)' }}>
                      Explore Books
                  </a>
              </div>
          </div>
      </main>

      <section id="features" className="features-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem', width: '100%' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>Powerful Features</h2>
              <p style={{ color: 'var(--text-muted)' }}>Everything you need to manage a modern library.</p>
          </div>
          
          <div className="feature-card">
              <BookOpen size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3>Book Management</h3>
              <p>Easily catalog, track, and update thousands of academic resources in real-time.</p>
          </div>
          <div className="feature-card">
              <CheckSquare size={40} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <h3>Request & Approval System</h3>
              <p>Streamlined workflow for handling student issue and return requests efficiently.</p>
          </div>
          <div className="feature-card">
              <Shield size={40} color="var(--warning)" style={{ marginBottom: '1rem' }} />
              <h3>Role-based Access</h3>
              <p>Dedicated dashboards for Students, Faculty, Librarians, and Administrators.</p>
          </div>
          <div className="feature-card">
              <Activity size={40} color="var(--rose)" style={{ marginBottom: '1rem' }} />
              <h3>Real-time Tracking</h3>
              <p>Monitor overdue books, pending requests, and inventory status instantly.</p>
          </div>
      </section>

      <section id="showcase" style={{ padding: '6rem 6%', background: 'var(--bg-surface)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>Book Showcase</h2>
              <p style={{ color: 'var(--text-muted)' }}>A glimpse into our vast academic collection.</p>
          </div>
          
          <div className="book-grid-view" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {displayBooks.map(book => (
                  <div key={book.id} className="management-card" style={{ padding: '2rem', textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                      {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} style={{ width: '140px', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }} />
                      ) : (
                          <div style={{ width: '140px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <BookOpen size={48} color="var(--text-muted)" />
                          </div>
                      )}
                      <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>{book.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>By {book.author}</p>
                      
                      <span className={`role-badge ${book.status === 'Available' ? 'badge-librarian' : 'badge-admin'}`} style={{ marginTop: 'auto' }}>
                          {book.status}
                      </span>
                  </div>
              ))}
          </div>
      </section>

      <section id="preview" style={{ padding: '6rem 6%', background: 'var(--bg-main)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>System Overview</h2>
              <p style={{ color: 'var(--text-muted)' }}>Real-time statistics from our active database.</p>
          </div>

          <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="stat-card primary-accent">
                  <div className="stat-icon primary"><Library size={28} /></div>
                  <div className="stat-info">
                      <h3>Total Books</h3>
                      <h2>{books.length > 0 ? books.length : '1,240+'}</h2>
                  </div>
              </div>
              <div className="stat-card warning-accent">
                  <div className="stat-icon warning"><Users size={28} /></div>
                  <div className="stat-info">
                      <h3>Active Members</h3>
                      <h2>{members.length > 0 ? members.length : '850+'}</h2>
                  </div>
              </div>
              <div className="stat-card success-accent">
                  <div className="stat-icon success"><FileText size={28} /></div>
                  <div className="stat-info">
                      <h3>Pending Requests</h3>
                      <h2>{issueRequests.length > 0 ? issueRequests.length : '12'}</h2>
                  </div>
              </div>
          </div>
      </section>

      <section style={{ padding: '6rem 6%', textAlign: 'center', background: 'radial-gradient(circle at center, var(--bg-surface) 0%, var(--bg-main) 100%)' }}>
          <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>Join the library today and unlock a world of knowledge.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn-primary btn-large">Login to Dashboard</Link>
              <Link to="/login" className="btn-outline btn-large">Create an Account</Link>
          </div>
      </section>

      <footer className="basic-footer" style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Library size={20} color="var(--primary)" />
              <span style={{ fontWeight: '700', color: '#fff' }}>Central Library SaaS</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
              <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#fff'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>About</a>
              <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#fff'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Contact</a>
              <a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#fff'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>Credits</a>
          </div>
          <p>&copy; {new Date().getFullYear()} College Central Library Project. All Rights Reserved.</p>
      </footer>
      <style>{`
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 6%;
            background: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0; width: 100%; z-index: 1000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .navbar .logo {
            display: flex; align-items: center; gap: 0.75rem;
            font-size: 1.5rem; font-weight: 700; color: #fff;
        }
        .nav-menu {
            display: flex; align-items: center; gap: 2rem;
        }
        .nav-menu a {
            color: var(--text-muted); font-weight: 500; transition: color 0.2s; text-decoration: none;
        }
        .nav-menu a:hover, .nav-menu a.active {
            color: #fff;
        }
        .landing-hero {
            background: radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.15) 0%, var(--bg-main) 60%);
            padding: 8rem 6% 4rem;
            text-align: center;
            display: flex; flex-direction: column; justify-content: center;
        }
        .hero-content h1 {
            font-size: 4rem; font-weight: 800; color: #fff; margin-bottom: 1.5rem; letter-spacing: -1px;
        }
        .hero-content h1 span {
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-content p {
            max-width: 700px; margin: 0 auto; color: var(--text-muted);
        }
        .hero-buttons {
            display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;
        }
        .features-section {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem; padding: 4rem 6%; background: var(--bg-main);
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 2rem; border-radius: 16px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            background: rgba(255, 255, 255, 0.04);
        }
        .feature-card h3 { color: #fff; margin-bottom: 0.5rem; font-size: 1.25rem; }
        .feature-card p { color: var(--text-muted); line-height: 1.6; }
        .book-grid-view {
            display: grid; gap: 2rem;
        }
        .role-badge {
            padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
        }
        .badge-librarian { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .badge-admin { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        @media (max-width: 768px) {
            .hero-content h1 { font-size: 2.5rem; }
            .nav-menu { display: none; } /* Could add hamburger, but hidden is fine for simplicity if not requested */
            .hero-buttons { flex-direction: column; }
            .features-section { grid-template-columns: 1fr; }
            .navbar { padding: 1rem 5%; }
        }
      `}</style>
    </>
  );
};

export default Landing;
