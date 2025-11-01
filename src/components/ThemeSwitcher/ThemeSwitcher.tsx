import React, { useState, useEffect } from 'react';
import { SwatchIcon } from '@heroicons/react/24/outline';
import './ThemeSwitcher.css';

const themes = [
  { name: 'Yellow', value: 'yellow', color: '#ffdc6a' },
  { name: 'Orange', value: 'orange', color: '#f59e0b' },
  { name: 'Blue', value: 'blue', color: '#3b82f6' },
  { name: 'Green', value: 'green', color: '#10b981' },
  { name: 'Purple', value: 'purple', color: '#8b5cf6' },
  { name: 'Pink', value: 'pink', color: '#ec4899' },
  { name: 'Red', value: 'red', color: '#ef4444' },
];

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('yellow');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('spice-theme') || 'yellow';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'yellow') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('spice-theme', theme);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.value === currentTheme);

  return (
    <div className="theme-switcher">
      <button
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme Color"
      >
        <SwatchIcon className="theme-icon" />
        <span className="current-theme-dot" style={{ backgroundColor: currentThemeData?.color }} />
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-header">
            <h3>Choose Theme Color</h3>
          </div>
          <div className="theme-grid">
            {themes.map((theme) => (
              <button
                key={theme.value}
                className={`theme-option ${currentTheme === theme.value ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.value)}
                style={{ '--theme-color': theme.color } as React.CSSProperties}
              >
                <div className="theme-color" style={{ backgroundColor: theme.color }} />
                <span className="theme-name">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && <div className="theme-overlay" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default ThemeSwitcher;