import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { 
  FireIcon, 
  ClockIcon, 
  StarIcon
} from '@heroicons/react/24/outline';
import { Video, SearchFilters } from '../../types/index';
import VideoCard from '../../components/VideoCard/VideoCard';
import FloatingSearch from '../../components/FloatingSearch/FloatingSearch';
import { videoService } from '../../services/videoService';
import './Dashboard.css';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Load initial videos
  useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingError(null);
      console.log('Loading initial videos from Firebase...');
      
      const result = await videoService.getVideosPaginated(15); // Start with 15 videos for faster load
      console.log(`Loaded ${result.videos.length} videos`);
      
      if (result.videos.length === 0) {
        setError('No videos found. Try adding some mock data first!');
      } else {
        setVideos(result.videos);
        setFilteredVideos(result.videos);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setError('Failed to load videos. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const loadMoreVideos = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      setLoadingError(null);
      console.log('Loading more videos...');
      
      const result = await videoService.getVideosPaginated(12, lastDoc); // Smaller chunks for better UX
      console.log(`Loaded ${result.videos.length} more videos`);
      
      if (result.videos.length === 0) {
        setHasMore(false);
        return;
      }
      
      const newVideos = [...videos, ...result.videos];
      setVideos(newVideos);
      
      // Update filtered videos if no active filters are applied
      const isFiltered = filteredVideos.length !== videos.length;
      if (!isFiltered) {
        setFilteredVideos(newVideos);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      
      // Show success feedback
      console.log(`Successfully loaded ${result.videos.length} more videos. Total: ${newVideos.length}`);
      
    } catch (error) {
      console.error('Error loading more videos:', error);
      setLoadingError('Failed to load more videos. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadVideos = loadInitialVideos; // For retry button

  // Data for filters
  const availableCourses = Array.from(new Set(videos.map(v => v.course)));
  const availableLecturers = Array.from(new Set(videos.map(v => v.lecturer)));
  const availableTags = Array.from(new Set(videos.flatMap(v => v.tags)));

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }

    try {
      // Use VideoService for search to leverage Firebase/Panopto
      const searchResults = await videoService.searchVideos(query);
      setFilteredVideos(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.lecturer.toLowerCase().includes(query.toLowerCase()) ||
        video.course.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    let filtered = videos;

    if (filters.course) {
      filtered = filtered.filter(v => 
        v.course.toLowerCase().includes(filters.course!.toLowerCase())
      );
    }

    if (filters.lecturer) {
      filtered = filtered.filter(v => 
        v.lecturer.toLowerCase().includes(filters.lecturer!.toLowerCase())
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(v => 
        v.averageRating.difficulty >= filters.difficulty![0] &&
        v.averageRating.difficulty <= filters.difficulty![1]
      );
    }

    if (filters.clarity) {
      filtered = filtered.filter(v => 
        v.averageRating.clarity >= filters.clarity![0] &&
        v.averageRating.clarity <= filters.clarity![1]
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(v => 
        filters.tags!.some(tag => v.tags.includes(tag))
      );
    }

    setFilteredVideos(filtered);
  };

  const categories = [
    { 
      name: 'Recent', 
      icon: ClockIcon,
      videos: filteredVideos // Show filtered results
    },
    { 
      name: 'Highly Rated', 
      icon: StarIcon,
      videos: filteredVideos
        .filter(v => v.totalRatings > 0 && (v.averageRating.difficulty + v.averageRating.importance + 
                     v.averageRating.clarity + v.averageRating.usefulness) / 4 >= 3.5)
    },
    { 
      name: 'Popular', 
      icon: FireIcon,
      videos: videos // Use ALL videos for popularity ranking
        .slice() // Create copy to avoid mutating original
        .sort((a, b) => b.viewCount - a.viewCount)
    }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Rate lectures and discover the spiciest content from Imperial College.
          </p>
          {loading && (
            <p className="loading-text">Loading videos from Firebase...</p>
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadVideos} className="retry-button">
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar - Below Header */}
      <div className="search-bar-container">
        <FloatingSearch
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
          availableCourses={availableCourses}
          availableLecturers={availableLecturers}
          availableTags={availableTags}
        />
      </div>

      {/* Video Categories */}
      <div className="video-categories">
        <Tab.Group onChange={setActiveTab}>
          <Tab.List className="tab-list">
            {categories.map((category) => (
              <Tab
                key={category.name}
                className={({ selected }) =>
                  classNames(
                    'tab-button',
                    selected ? 'tab-button-active' : 'tab-button-inactive'
                  )
                }
              >
                <category.icon className="tab-icon" />
                {category.name}
                <span className="video-count">({category.videos.length})</span>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="tab-panels">
            {categories.map((category, idx) => (
              <Tab.Panel key={idx} className="tab-panel">
                <div className="video-grid">
                  {category.videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      compact={false}
                    />
                  ))}
                </div>
                
                {/* Load More Button - show when there's more data and we're viewing the source videos */}
                {!loading && hasMore && filteredVideos.length === videos.length && activeTab === idx && (
                  <div className="load-more-container">
                    <button 
                      onClick={loadMoreVideos} 
                      disabled={loadingMore}
                      className="load-more-button"
                    >
                      {loadingMore ? (
                        <span className="loading-spinner">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        `Load More Videos (+${12})`
                      )}
                    </button>
                    {loadingError && (
                      <p className="load-error">{loadingError}</p>
                    )}
                  </div>
                )}
                
                {/* Show pagination info */}
                {!loading && videos.length > 0 && activeTab === idx && (
                  <div className="pagination-info">
                    <p>Showing <strong>{Math.min(category.videos.length, videos.length)}</strong> videos</p>
                    {!hasMore && <p className="no-more-text">• That's all the spicy content! 🌶️</p>}
                  </div>
                )}
                
                {!loading && !initialLoad && category.videos.length === 0 && (
                  <div className="empty-state">
                    <p>No videos found matching your search criteria.</p>
                    {videos.length === 0 && (
                      <div>
                        <p>No videos found in Firebase.</p>
                        <p>Run <code>populateFirebase.quick()</code> in the browser console to add mock data!</p>
                        <button onClick={loadVideos} className="reload-button">
                          Reload
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {loading && initialLoad && (
                  <div className="empty-state">
                    <p>Loading videos...</p>
                  </div>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Dashboard;