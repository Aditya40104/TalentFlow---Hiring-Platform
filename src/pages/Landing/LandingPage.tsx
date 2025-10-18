import { Link } from 'react-router-dom';
import { Button } from '@/components';
import './LandingPage.css';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Modern Hiring Platform</span>
          </div>
          
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">TalentFlow</span>
          </h1>
          
          <p className="hero-description">
            A comprehensive mini hiring platform built with React, TypeScript, and Vite.
            Manage jobs, track candidates, and create assessments—all in one place.
          </p>

          <div className="hero-actions">
            <Link to="/jobs">
              <Button size="lg">Get Started →</Button>
            </Link>
            <a 
              href="https://github.com/Aditya40104/TalentFlow---Hiring-Platform" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                View on GitHub
              </Button>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">1200+</div>
              <div className="stat-label">Sample Candidates</div>
            </div>
            <div className="stat">
              <div className="stat-number">5</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat">
              <div className="stat-number">6</div>
              <div className="stat-label">Pipeline Stages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <h2 className="features-title">Everything you need to hire great talent</h2>
        <p className="features-subtitle">
          Powerful features designed for modern recruitment workflows
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Jobs Management</h3>
            <p>
              Create and manage job postings with drag-and-drop reordering, 
              archive functionality, and unique slug generation.
            </p>
            <ul className="feature-list">
              <li>Paginated listings with search & filters</li>
              <li>Drag-and-drop reordering</li>
              <li>Archive/Unarchive jobs</li>
              <li>Tag-based categorization</li>
            </ul>
            <Link to="/jobs" className="feature-link">
              Explore Jobs →
            </Link>
          </div>

          <div className="feature-card featured">
            <div className="feature-badge">Most Popular</div>
            <div className="feature-icon">👥</div>
            <h3>Candidate Tracking</h3>
            <p>
              Track 1000+ candidates with virtualized lists, kanban boards, 
              timeline views, and collaborative notes.
            </p>
            <ul className="feature-list">
              <li>Virtualized list for performance</li>
              <li>Kanban board with 6 stages</li>
              <li>Timeline & stage history</li>
              <li>Notes with @mentions</li>
            </ul>
            <Link to="/candidates" className="feature-link">
              View Candidates →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Assessment Builder</h3>
            <p>
              Build comprehensive assessments with 6 question types, 
              conditional logic, and live preview mode.
            </p>
            <ul className="feature-list">
              <li>6 question types supported</li>
              <li>Conditional question logic</li>
              <li>Form validation rules</li>
              <li>Live preview mode</li>
            </ul>
            <Link to="/assessments" className="feature-link">
              Create Assessments →
            </Link>
          </div>
        </div>
      </div>

      <div className="landing-tech">
        <h2 className="tech-title">Built with Modern Technology</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <div className="tech-logo">⚛️</div>
            <div className="tech-name">React 19</div>
          </div>
          <div className="tech-item">
            <div className="tech-logo">📘</div>
            <div className="tech-name">TypeScript</div>
          </div>
          <div className="tech-item">
            <div className="tech-logo">⚡</div>
            <div className="tech-name">Vite</div>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🗃️</div>
            <div className="tech-name">IndexedDB</div>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🔄</div>
            <div className="tech-name">MSW</div>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🎨</div>
            <div className="tech-name">CSS3</div>
          </div>
        </div>
      </div>

      <div className="landing-cta">
        <div className="cta-content">
          <h2>Ready to streamline your hiring?</h2>
          <p>Start managing your recruitment pipeline with TalentFlow today.</p>
          <Link to="/jobs">
            <Button size="lg">Get Started for Free →</Button>
          </Link>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-logo">TalentFlow</h3>
            <p>Modern hiring platform for modern teams</p>
          </div>
          <div className="footer-links">
            <Link to="/jobs">Jobs</Link>
            <Link to="/candidates">Candidates</Link>
            <Link to="/assessments">Assessments</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built with ❤️ by Aditya Kumar</p>
        </div>
      </footer>
    </div>
  );
};
