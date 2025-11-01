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

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onRate, 
  showFullDescription = false, 
  compact = false 
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const averageSpiceLevel = Math.round(
    (video.averageRating.difficulty + 
     video.averageRating.importance + 
     video.averageRating.clarity + 
     video.averageRating.usefulness) / 4
  );

  const description = showFullDescription 
    ? video.description 
    : video.description.length > 120 
      ? `${video.description.substring(0, 120)}...` 
      : video.description;

  return (
    <div className={`video-card ${compact ? 'video-card-compact' : ''}`}>
      {/* Thumbnail */}
      <div className="video-thumbnail">
        <Link to={`/video/${video.id}`}>
          <div className="thumbnail-placeholder">
            <PlayIcon className="play-icon" />
          </div>
        </Link>
        <div className="video-duration">
          <ClockIcon className="duration-icon" />
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Content */}
      <div className="video-content">
        <div className="video-header">
          <Link to={`/video/${video.id}`}>
            <h3 className="video-title">{video.title}</h3>
          </Link>
          <div className="spice-level-container">
            <div className="spice-level">
              <SpiceRating 
                value={averageSpiceLevel} 
                readonly 
                size="sm" 
              />
            </div>
            {/* Hover Tooltip */}
            <div className="rating-tooltip">
              <div className="tooltip-content">
                <div className="tooltip-row">
                  <span className="tooltip-label">Difficulty</span>
                  <SpiceRating 
                    value={video.averageRating.difficulty} 
                    readonly 
                    size="sm" 
                  />
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Clarity</span>
                  <SpiceRating 
                    value={video.averageRating.clarity} 
                    readonly 
                    size="sm" 
                  />
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Importance</span>
                  <SpiceRating 
                    value={video.averageRating.importance} 
                    readonly 
                    size="sm" 
                  />
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-label">Usefulness</span>
                  <SpiceRating 
                    value={video.averageRating.usefulness} 
                    readonly 
                    size="sm" 
                  />
                </div>
                <div className="tooltip-footer">
                  <span className="total-ratings">{video.totalRatings} total ratings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="video-meta">
          <div className="meta-item">
            <UserIcon className="meta-icon" />
            <span>{video.lecturer}</span>
          </div>
          <div className="meta-item">
            <span className="course-badge">{video.course}</span>
          </div>
        </div>

        <p className="video-description">{description}</p>

        {/* Tags */}
        {!compact && (
          <div className="video-tags">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="tag tag-more">
                +{video.tags.length - 3} more
              </span>
            )}
          </div>
        )}



        {/* Stats */}
        <div className="video-stats">
          <div className="stat-item">
            <EyeIcon className="stat-icon" />
            <span>{formatViews(video.viewCount)} views</span>
          </div>
          <div className="stat-item">
            <StarIcon className="stat-icon" />
            <span>{video.totalRatings} ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;