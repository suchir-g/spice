import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  EyeIcon,
  StarIcon,
  BookOpenIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { VideoDetails as VideoDetailsType, Comment, Rating, PrerequisiteAnalysis } from '../../types/index';
import { videoService } from '../../services/videoService';
import SpiceRating from '../../components/SpiceRating/SpiceRating';
import './VideoDetails.css';

const VideoDetails: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<VideoDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [formRating, setFormRating] = useState<Rating>({
    difficulty: 0,
    importance: 0,
    clarity: 0,
    usefulness: 0
  });

  useEffect(() => {
    if (videoId) {
      loadVideoDetails();
    }
  }, [videoId]);

  const loadVideoDetails = async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get video from service
      const videoData = await videoService.getVideo(videoId);
      
      if (!videoData) {
        setError('Video not found');
        return;
      }

      // Convert to VideoDetails with mock enhanced data
      const enhancedVideo: VideoDetailsType = {
        ...videoData,
        comments: generateMockComments(videoId),
        prerequisiteAnalysis: generatePrerequisiteAnalysis(videoData.tags, videoData.course)
      };

      setVideo(enhancedVideo);
      setComments(enhancedVideo.comments);
      
    } catch (error) {
      console.error('Error loading video details:', error);
      setError('Failed to load video details');
    } finally {
      setLoading(false);
    }
  };

  const generateMockComments = (videoId: string): Comment[] => {
    const mockUsers = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson'];
    const mockComments: Comment[] = [];
    
    for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
      const comment: Comment = {
        id: `comment-${i}`,
        videoId,
        userId: `user-${i}`,
        userName: mockUsers[i % mockUsers.length],
        content: [
          "This lecture really helped clarify the concepts!",
          "Great explanation of the mathematical proofs.",
          "Could use more examples, but overall very clear.",
          "The professor's teaching style is excellent.",
          "Perfect preparation for the exam.",
          "Loved the practical applications shown.",
          "Clear and concise explanation.",
          "This should be required viewing!"
        ][Math.floor(Math.random() * 8)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 15),
        likedBy: []
      };
      mockComments.push(comment);
    }
    
    return mockComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const generatePrerequisiteAnalysis = (tags: string[], course: string): PrerequisiteAnalysis => {
    const allPrerequisites = [
      'Linear Algebra', 'Calculus I', 'Calculus II', 'Statistics', 'Discrete Mathematics',
      'Programming Fundamentals', 'Data Structures', 'Algorithms', 'Probability Theory',
      'Mathematical Analysis', 'Differential Equations', 'Complex Analysis'
    ];
    
    // Generate prerequisites based on tags and course
    const suggested = allPrerequisites
      .filter(() => Math.random() > 0.7)
      .slice(0, Math.floor(Math.random() * 4) + 1);
    
    return {
      suggestedPrerequisites: suggested,
      confidence: 0.7 + Math.random() * 0.3,
      keywordMatches: tags.slice(0, 3),
      recommendedOrder: suggested
    };
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !videoId) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      videoId,
      userId: 'current-user',
      userName: 'You',
      content: newComment,
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleRateVideo = async () => {
    if (!videoId) return;
    
    try {
      await videoService.rateVideo(videoId, formRating);
      setUserRating(formRating);
      setShowRatingForm(false);
      // Reload video to get updated ratings
      loadVideoDetails();
    } catch (error) {
      console.error('Error rating video:', error);
    }
  };

  const updateFormRating = (category: keyof Rating, value: number) => {
    setFormRating(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getPanoptoUrl = () => {
    if (!video?.panoptoId) return '#';
    return `https://imperial.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=${video.panoptoId}`;
  };

  if (loading) {
    return (
      <div className="video-details loading">
        <div className="loading-spinner">Loading video details...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-details error">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Video not found'}</p>
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="video-details">
      <div className="video-details-container">
        {/* Header */}
        <div className="video-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <div className="video-meta">
            <h1 className="video-title">{video.title}</h1>
            <div className="video-info">
              <span className="course-code">{video.course}</span>
              <span className="lecturer">👨‍🏫 {video.lecturer}</span>
              <span className="upload-date">
                <CalendarIcon className="icon" />
                {video.uploadDate.toLocaleDateString()}
              </span>
              <span className="duration">
                <ClockIcon className="icon" />
                {video.duration} min
              </span>
              <span className="view-count">
                <EyeIcon className="icon" />
                {video.viewCount} views
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="video-content">
          {/* Video Player Section */}
          <div className="video-player-section">
            <div className="video-player">
              <div className="video-placeholder">
                <PlayIcon className="play-icon" />
                <p>Video Player Placeholder</p>
                <p className="video-id">Video ID: {video.id}</p>
              </div>
            </div>
            
            {/* Panopto Link */}
            <div className="external-links">
              <a 
                href={getPanoptoUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="panopto-link"
              >
                <ArrowTopRightOnSquareIcon className="icon" />
                View on Panopto
              </a>
            </div>

            {/* Description */}
            <div className="video-description">
              <h3>Description</h3>
              <p>{video.description}</p>
              
              {/* Tags */}
              <div className="video-tags">
                <TagIcon className="tag-icon" />
                {video.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="video-sidebar">
            {/* Ratings Section */}
            <div className="ratings-section">
              <h3>Ratings</h3>
              <div className="current-ratings">
                <div className="rating-item">
                  <span className="rating-label">Difficulty</span>
                  <SpiceRating value={video.averageRating.difficulty} readonly />
                </div>
                <div className="rating-item">
                  <span className="rating-label">Importance</span>
                  <SpiceRating value={video.averageRating.importance} readonly />
                </div>
                <div className="rating-item">
                  <span className="rating-label">Clarity</span>
                  <SpiceRating value={video.averageRating.clarity} readonly />
                </div>
                <div className="rating-item">
                  <span className="rating-label">Usefulness</span>
                  <SpiceRating value={video.averageRating.usefulness} readonly />
                </div>
              </div>
              
              <div className="rating-summary">
                <p>{video.totalRatings} total ratings</p>
                <button 
                  onClick={() => {
                    setShowRatingForm(!showRatingForm);
                    if (!showRatingForm) {
                      // Reset form when opening
                      setFormRating({
                        difficulty: 0,
                        importance: 0,
                        clarity: 0,
                        usefulness: 0
                      });
                    }
                  }}
                  className="rate-button"
                >
                  <StarIcon className="icon" />
                  {userRating ? 'Update Rating' : 'Rate This Video'}
                </button>
              </div>

              {/* Rating Form */}
              {showRatingForm && (
                <div className="rating-form">
                  <h4>Rate this video</h4>
                  <div className="rating-categories">
                    <div className="rating-category">
                      <span className="category-label">Difficulty</span>
                      <SpiceRating 
                        value={formRating.difficulty} 
                        onChange={(value) => updateFormRating('difficulty', value)}
                        size="sm"
                      />
                    </div>
                    <div className="rating-category">
                      <span className="category-label">Importance</span>
                      <SpiceRating 
                        value={formRating.importance} 
                        onChange={(value) => updateFormRating('importance', value)}
                        size="sm"
                      />
                    </div>
                    <div className="rating-category">
                      <span className="category-label">Clarity</span>
                      <SpiceRating 
                        value={formRating.clarity} 
                        onChange={(value) => updateFormRating('clarity', value)}
                        size="sm"
                      />
                    </div>
                    <div className="rating-category">
                      <span className="category-label">Usefulness</span>
                      <SpiceRating 
                        value={formRating.usefulness} 
                        onChange={(value) => updateFormRating('usefulness', value)}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="rating-form-actions">
                    <button onClick={() => setShowRatingForm(false)}>Cancel</button>
                    <button 
                      onClick={handleRateVideo}
                      disabled={formRating.difficulty === 0 || formRating.importance === 0 || formRating.clarity === 0 || formRating.usefulness === 0}
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prerequisites Section */}
            <div className="prerequisites-section">
              <h3>
                <BookOpenIcon className="icon" />
                Prerequisites
              </h3>
              <p className="prerequisite-info">
                Based on keyword analysis and course content
              </p>
              <div className="prerequisite-confidence">
                Confidence: {Math.round(video.prerequisiteAnalysis.confidence * 100)}%
              </div>
              <ul className="prerequisites-list">
                {video.prerequisiteAnalysis.suggestedPrerequisites.map((prereq: string) => (
                  <li key={prereq} className="prerequisite-item">
                    {prereq}
                  </li>
                ))}
              </ul>
              <div className="keyword-matches">
                <h4>Key Topics:</h4>
                {video.prerequisiteAnalysis.keywordMatches.map((keyword: string) => (
                  <span key={keyword} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>
            <ChatBubbleLeftIcon className="icon" />
            Comments ({comments.length})
          </h3>
          
          {/* Add Comment */}
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="comment-textarea"
            />
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="submit-comment-btn"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.userName}</span>
                  <span className="comment-date">
                    {comment.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
                <div className="comment-actions">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className="like-button"
                  >
                    <HeartIcon className="icon" />
                    {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;