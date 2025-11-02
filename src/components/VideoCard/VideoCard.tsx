import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayIcon, 
  ClockIcon, 
  EyeIcon, 
  StarIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { VideoCardProps } from '../../types/index';
import SpiceRating from '../SpiceRating/SpiceRating';
import './VideoCard.css';

const VideoCard: React.FC<VideoCardProps & { style?: React.CSSProperties; variant?: 'dashboard' | 'detail' }> = ({ 
  video, 
  style,
  variant = 'dashboard'
}) => {
  // Combine user ratings and machine rating
  const userRatingAverage = (
    video.averageRating.difficulty + 
    video.averageRating.importance + 
    video.averageRating.clarity + 
    video.averageRating.usefulness
  ) / 4;
  
  // TODO: Replace this with actual machine learning rating
  const machineRating = 3.5; // Placeholder machine-generated rating
  
  // Weighted combination: 70% user ratings, 30% machine rating
  const averageSpiceLevel = Math.round(
    (userRatingAverage * 0.7) + (machineRating * 0.3)
  );

  if (variant === 'dashboard') {
    return (
      <div 
        className="dashboard-video-card" 
        style={style}
        data-spice={averageSpiceLevel}
      >
        <Link to={`/video/${video.id}`} className="card-content">
          <div className="thumbnail">
            <img src="/mock-thumbail.jpg" alt={video.title} className="thumbnail-image" />
            <PlayIcon className="play-icon" />
          </div>
          
          <div className="info">
            <div className="title-row">
              <h3>{video.title}</h3>
              {video.totalRatings > 0 && (
                <SpiceRating 
                  value={averageSpiceLevel} 
                  readonly 
                  size="sm"
                  userScore={userRatingAverage}
                  machineScore={machineRating}
                />
              )}
            </div>
            <p className="description">{video.description}</p>
            <div className="metadata">
              <span>{video.lecturer}</span>
              <span className="bullet">•</span>
              <span>{video.course}</span>
              <span className="bullet">•</span>
              <span>{video.totalRatings} ratings</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Detail variant (used in video page)
  return (
    <div className="detail-video-card" style={style}>
      <div className="video-thumbnail">
        <Link to={`/video/${video.id}`}>
          <img src="/mock-thumbail.jpg" alt={video.title} className="thumbnail-image" />
          <PlayIcon className="play-icon" />
        </Link>
      </div>

      <div className="video-content">
        <div className="header-row">
          <Link to={`/video/${video.id}`} className="video-title-link">
            <h3 className="video-title">{video.title}</h3>
          </Link>
          {video.totalRatings > 0 && (
            <SpiceRating 
              value={averageSpiceLevel} 
              readonly 
              size="sm" 
              userScore={userRatingAverage}
              machineScore={machineRating}
            />
          )}
        </div>

        <p className="video-description">{video.description}</p>

        <div className="footer-row">
          <div className="lecturer-info">
            <UserIcon className="lecturer-icon" />
            <span>{video.lecturer}</span>
            <span className="course-badge">• {video.course}</span>
          </div>
          <div className="ratings-count">
            <StarIcon className="star-icon" />
            <span>{video.totalRatings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;