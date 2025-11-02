import React, { useState, useEffect, useMemo } from 'react';
import { Video } from '../../types/index';
import VideoCard from '../../components/VideoCard/VideoCard';
import { videoService } from '../../services/videoService';
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import './Dashboard.css';

type SortOption = 'spice' | 'recent' | 'recommended';

interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  selectedProfessors: string[];
  selectedCourses: string[];
  minSpiceLevel: number;
  maxSpiceLevel: number;
}

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('spice');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    tags: boolean;
    professors: boolean;
    courses: boolean;
  }>({
    tags: false,
    professors: false,
    courses: false
  });
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    selectedProfessors: [],
    selectedCourses: [],
    minSpiceLevel: 0,
    maxSpiceLevel: 5
  });

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const tags = new Set<string>();
    const professors = new Set<string>();
    const courses = new Set<string>();

    videos.forEach(video => {
      if (video.tags) {
        video.tags.forEach(tag => tags.add(tag));
      }
      professors.add(video.lecturer);
      courses.add(video.course);
    });

    return {
      tags: Array.from(tags).sort(),
      professors: Array.from(professors).sort(),
      courses: Array.from(courses).sort()
    };
  }, [videos]);

  const calculateSpiceScore = (video: Video) => {
    const userRatingAverage = (
      video.averageRating.difficulty + 
      video.averageRating.importance + 
      video.averageRating.clarity + 
      video.averageRating.usefulness
    ) / 4;
    
    // TODO: Replace with actual machine learning rating
    const machineRating = 3.5;
    
    return (userRatingAverage * 0.7) + (machineRating * 0.3);
  };

  const calculateRecommendedScore = (video: Video) => {
    // Recommended focuses more on practical value for students
    return (
      video.averageRating.importance * 0.4 +     // How crucial is this content?
      video.averageRating.usefulness * 0.3 +     // How applicable is it?
      video.averageRating.clarity * 0.2 +        // How well is it explained?
      video.averageRating.difficulty * 0.1       // Lower weight for difficulty
    );
  };

  const filterVideos = (videos: Video[]) => {
    return videos.filter(video => {
      // Text search
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        filters.searchQuery === '' ||
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.lecturer.toLowerCase().includes(searchLower) ||
        video.course.toLowerCase().includes(searchLower) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchLower)));

      // Tag filtering
      const matchesTags = 
        filters.selectedTags.length === 0 ||
        (video.tags && filters.selectedTags.every(tag => video.tags.includes(tag)));

      // Professor filtering
      const matchesProfessor = 
        filters.selectedProfessors.length === 0 ||
        filters.selectedProfessors.includes(video.lecturer);

      // Course filtering
      const matchesCourse = 
        filters.selectedCourses.length === 0 ||
        filters.selectedCourses.includes(video.course);

      // Spice level filtering
      const videoSpice = calculateSpiceScore(video);
      const matchesSpiceLevel = 
        videoSpice >= filters.minSpiceLevel && 
        videoSpice <= filters.maxSpiceLevel;

      return matchesSearch && matchesTags && matchesProfessor && 
             matchesCourse && matchesSpiceLevel;
    });
  };

  const sortVideos = (videos: Video[], sortOption: SortOption) => {
    const sortedVideos = [...videos];
    
    switch (sortOption) {
      case 'spice':
        // Spice is about overall intensity and challenge
        sortedVideos.sort((a, b) => calculateSpiceScore(b) - calculateSpiceScore(a));
        break;
      case 'recent':
        sortedVideos.sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      case 'recommended':
        // Recommended is about practical value and accessibility
        sortedVideos.sort((a, b) => calculateRecommendedScore(b) - calculateRecommendedScore(a));
        break;
    }
    
    return sortedVideos;
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Apply filters and sorting whenever filters or sort option changes
  useEffect(() => {
    if (videos.length > 0) {
      const filtered = filterVideos(videos);
      const sorted = sortVideos(filtered, sortBy);
      setFilteredVideos(sorted);
    }
  }, [filters, sortBy, videos]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await videoService.getVideosPaginated(50);
      
      if (result.videos.length === 0) {
        setError('No videos found.');
      } else {
        setVideos(result.videos);
        const filtered = filterVideos(result.videos);
        const sorted = sortVideos(filtered, sortBy);
        setFilteredVideos(sorted);
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
          <h1 className="dashboard-title">All Videos</h1>
          <p className="dashboard-subtitle">
            Our algorithms analyze ratings and engagement to highlight the lectures you <b>can't afford to miss</b>. 
            Sorted by our <b>spice score</b> to prioritize the most impactful content.
          </p>
        </div>
        
        <div className="dashboard-controls">
          <div className="search-bar">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search videos..."
              value={filters.searchQuery}
              onChange={(e) => {
                const value = e.target.value.trim();
                setFilters(prev => ({...prev, searchQuery: value}));
              }}
              className="search-input"
            />
          </div>

          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="filter-icon" />
            {filters.selectedTags.length > 0 || 
             filters.selectedProfessors.length > 0 || 
             filters.selectedCourses.length > 0 ? (
              <span className="filter-count">
                {filters.selectedTags.length + 
                 filters.selectedProfessors.length + 
                 filters.selectedCourses.length}
              </span>
            ) : null}
          </button>

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
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <h3>Tags</h3>
            <div className="tag-list">
              {(expandedSections.tags ? filterOptions.tags : filterOptions.tags.slice(0, 8)).map(tag => (
                <button
                  key={tag}
                  className={`tag-button ${filters.selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => {
                    const newTags = filters.selectedTags.includes(tag)
                      ? filters.selectedTags.filter(t => t !== tag)
                      : [...filters.selectedTags, tag];
                    setFilters({...filters, selectedTags: newTags});
                  }}
                >
                  {tag}
                </button>
              ))}
              {filterOptions.tags.length > 8 && (
                <button
                  className="show-more-button"
                  onClick={() => setExpandedSections(prev => ({...prev, tags: !prev.tags}))}
                >
                  {expandedSections.tags ? 'Show Less' : `+${filterOptions.tags.length - 8} More`}
                </button>
              )}
            </div>
          </div>

          <div className="filter-section">
            <h3>Professors</h3>
            <div className="professor-list">
              {(expandedSections.professors ? filterOptions.professors : filterOptions.professors.slice(0, 6)).map(professor => (
                <button
                  key={professor}
                  className={`professor-button ${filters.selectedProfessors.includes(professor) ? 'selected' : ''}`}
                  onClick={() => {
                    const newProfessors = filters.selectedProfessors.includes(professor)
                      ? filters.selectedProfessors.filter(p => p !== professor)
                      : [...filters.selectedProfessors, professor];
                    setFilters({...filters, selectedProfessors: newProfessors});
                  }}
                >
                  {professor}
                </button>
              ))}
              {filterOptions.professors.length > 6 && (
                <button
                  className="show-more-button"
                  onClick={() => setExpandedSections(prev => ({...prev, professors: !prev.professors}))}
                >
                  {expandedSections.professors ? 'Show Less' : `+${filterOptions.professors.length - 6} More`}
                </button>
              )}
            </div>
          </div>

          <div className="filter-section">
            <h3>Courses</h3>
            <div className="course-list">
              {(expandedSections.courses ? filterOptions.courses : filterOptions.courses.slice(0, 6)).map(course => (
                <button
                  key={course}
                  className={`course-button ${filters.selectedCourses.includes(course) ? 'selected' : ''}`}
                  onClick={() => {
                    const newCourses = filters.selectedCourses.includes(course)
                      ? filters.selectedCourses.filter(c => c !== course)
                      : [...filters.selectedCourses, course];
                    setFilters({...filters, selectedCourses: newCourses});
                  }}
                >
                  {course}
                </button>
              ))}
              {filterOptions.courses.length > 6 && (
                <button
                  className="show-more-button"
                  onClick={() => setExpandedSections(prev => ({...prev, courses: !prev.courses}))}
                >
                  {expandedSections.courses ? 'Show Less' : `+${filterOptions.courses.length - 6} More`}
                </button>
              )}
            </div>
          </div>

          <div className="filter-section">
            <h3>Spice Level</h3>
            <div className="spice-range">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minSpiceLevel}
                onChange={(e) => setFilters({...filters, minSpiceLevel: parseFloat(e.target.value)})}
              />
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.maxSpiceLevel}
                onChange={(e) => setFilters({...filters, maxSpiceLevel: parseFloat(e.target.value)})}
              />
              <div className="spice-range-labels">
                <span>{filters.minSpiceLevel.toFixed(1)}</span>
                <span>to</span>
                <span>{filters.maxSpiceLevel.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({
              searchQuery: '',
              selectedTags: [],
              selectedProfessors: [],
              selectedCourses: [],
              minSpiceLevel: 0,
              maxSpiceLevel: 5
            })}
          >
            <XMarkIcon className="clear-icon" />
            Clear Filters
          </button>
        </div>
      )}

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
          {filteredVideos.map((video, index) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              compact={false} 
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {!loading && filteredVideos.length === 0 && !error && (
        <div className="empty-state">
          <p>No videos found.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;