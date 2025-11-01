import React from 'react';
import { SpiceRatingProps } from '../../types/index';
import './SpiceRating.css';

const SpiceRating: React.FC<SpiceRatingProps> = ({ 
  value, 
  onChange, 
  readonly = false, 
  size = 'md', 
  label 
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
    <div className="spice-rating">
      {label && <span className="rating-label">{label}</span>}
      <div className="peppers-container">
        {Array.from({ length: 5 }, (_, index) => renderPepper(index))}
      </div>
      {!readonly && (
        <span className="rating-value" aria-live="polite">
          {value}/5
        </span>
      )}
    </div>
  );
};

export default SpiceRating;