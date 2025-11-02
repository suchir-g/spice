import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import './Layout.css';
import '../../styles/themes.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-full">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-brand">
              <Link to="/" className="brand-link">
                <span className="brand-text">spice 🌶️</span>
              </Link>
            </div>
            <div className="navbar-menu-desktop">
              <div className="nav-links">
                <Link to="/dashboard" className="nav-link-base nav-link">
                  Videos
                </Link>
              </div>
            </div>
            <div className="navbar-actions">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;