import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-title">
          <span className="landing-emoji">🌶️</span>
          <span className="landing-text">spice</span>
        </h1>
        <p className="landing-subtitle">
          Rate your lectures. Find the ones that matter.
        </p>
        <button 
          className="cta-button"
          onClick={() => navigate('/dashboard')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;