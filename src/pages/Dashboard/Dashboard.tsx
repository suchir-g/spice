import React, { useState, useEffect } from 'react';
import { Video } from '../../types/index';
import VideoCard from '../../components/VideoCard/VideoCard';
import { videoService } from '../../services/videoService';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import './Dashboard.css';

type SortOption = 'spice' | 'recent' | 'recommended';

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('spice');

  const sortVideos = (videos: Video[], sortOption: SortOption) => {
    const sortedVideos = [...videos];
    
    switch (sortOption) {
      case 'spice':
        sortedVideos.sort((a, b) => {
          const aSpice = (a.averageRating.difficulty + a.averageRating.importance + 
                         a.averageRating.clarity + a.averageRating.usefulness) / 4;
          const bSpice = (b.averageRating.difficulty + b.averageRating.importance + 
                         b.averageRating.clarity + b.averageRating.usefulness) / 4;
          return bSpice - aSpice;
        });
        break;
      case 'recent':
        sortedVideos.sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      case 'recommended':
        sortedVideos.sort((a, b) => {
          const aScore = (a.averageRating.importance * 2 + a.averageRating.clarity + 
                         a.averageRating.usefulness * 1.5) / 4.5;
          const bScore = (b.averageRating.importance * 2 + b.averageRating.clarity + 
                         b.averageRating.usefulness * 1.5) / 4.5;
          return bScore - aScore;
        });
        break;
    }
    
    setVideos(sortedVideos);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      sortVideos(videos, sortBy);
    }
  }, [sortBy]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await videoService.getVideosPaginated(50);
      
      if (result.videos.length === 0) {
        setError('No videos found.');
      } else {
        setVideos(result.videos);
        sortVideos(result.videos, sortBy);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Failed to load videos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Spice for Panopto - rate your lectures and figure out which lectures you <b>definitely</b> can't miss.
          </p>
        </div>
        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="spice">Sort by Spice Level</option>
            <option value="recent">Sort by Recent</option>
            <option value="recommended">Sort by Recommended</option>
          </select>
          <ChevronDownIcon className="sort-icon" />
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <p>Loading videos...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadVideos} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="video-grid">
          {videos.map((video, index) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              compact={false} 
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="empty-state">
          <p>No videos found.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;