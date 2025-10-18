import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">TalentFlow</h1>
          <p className="tagline">Mini Hiring Platform</p>
        </div>
        <ul className="nav-menu">
          <li>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">💼</span>
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">👥</span>
              Candidates
            </NavLink>
          </li>
          <li>
            <NavLink to="/assessments" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">📝</span>
              Assessments
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};
