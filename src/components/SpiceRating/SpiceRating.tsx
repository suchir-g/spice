import React from 'react';
import { SpiceRatingProps } from '../../types/index';
import './SpiceRating.css';

interface ExtendedSpiceRatingProps extends SpiceRatingProps {
  userScore?: number;
  machineScore?: number;
}

const SpiceRating: React.FC<ExtendedSpiceRatingProps> = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 'md', 
  label,
  userScore,
  machineScore
}) => {
  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const renderPepper = (index: number) => {
    const isActive = index < value;
    const pepperClass = `pepper pepper-${size} ${isActive ? 'pepper-active' : 'pepper-inactive'} ${!readonly ? 'pepper-interactive' : ''}`;
    
    return (
      <button
        key={index}
        className={pepperClass}
        onClick={() => handleClick(index + 1)}
        disabled={readonly}
        type="button"
        aria-label={`${index + 1} pepper${index > 0 ? 's' : ''}`}
      >
        🌶️
      </button>
    );
  };

  return (
    <div className="spice-rating" title={
      userScore && machineScore
        ? `Spice Score: ${value}
User Rating: ${userScore.toFixed(1)}
AI Rating: ${machineScore.toFixed(1)}`
        : undefined
    }>
      {label && <span className="rating-label">{label}</span>}
      <div className="peppers-container">
        {Array.from({ length: 5 }, (_, index) => renderPepper(index))}
      </div>
      {!readonly && (
        <span className="rating-value" aria-live="polite">
          {value}/5
        </span>
      )}
      {userScore && machineScore && (
        <div className="score-tooltip">
          <div className="score-breakdown">
            <div className="score-row">
              <span>Final Score:</span>
              <strong>{value.toFixed(1)}</strong>
            </div>
            <div className="score-row">
              <span>User Rating:</span>
              <span>{userScore.toFixed(1)}</span>
            </div>
            <div className="score-row">
              <span>AI Rating:</span>
              <span>{machineScore.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiceRating;