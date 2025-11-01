import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'yellow' | 'red' | 'green';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-content">
        <div className="stats-card-header">
          <div className="stats-card-info">
            <h3 className="stats-card-title">{title}</h3>
            <p className="stats-card-value">{value}</p>
          </div>
          <div className={`stats-card-icon stats-card-icon-${color}`}>
            <Icon className="icon" />
          </div>
        </div>
        
        {trend && (
          <div className="stats-card-trend">
            <span className={`trend-indicator ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="trend-text">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;