export interface Video {
  id: string;
  title: string;
  lecturer: string;
  course: string;
  description: string;
  duration: number; // in minutes
  uploadDate: Date;
  viewCount: number;
  totalRatings: number;
  averageRating: {
    difficulty: number;
    importance: number;
    clarity: number;
    usefulness: number;
  };
  tags: string[];
  thumbnailUrl?: string;
  panoptoId?: string;
  prerequisites?: string[];
}

export interface Rating {
  difficulty: number; // 1-5 scale
  importance: number; // 1-5 scale  
  clarity: number; // 1-5 scale
  usefulness: number; // 1-5 scale
  comment?: string;
}

export interface VideoRating {
  id: string;
  videoId: string;
  userId?: string;
  rating: Rating;
  comment?: string;
  timestamp?: Date;
  createdAt?: Date;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  parentId?: string; // For replies
  replies?: Comment[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  lecturer?: string;
  description?: string;
  department?: string;
  semester?: string;
  lecturers?: string[];
  videos?: string[];
}

export interface VideoCardProps {
  video: Video;
  compact?: boolean;
  onClick?: () => void;
  onRate?: (videoId: string, rating: Rating) => void;
  showFullDescription?: boolean;
}

export interface SearchFilters {
  course?: string;
  lecturer?: string;
  difficulty?: [number, number];
  importance?: [number, number];
  clarity?: [number, number];
  usefulness?: [number, number];
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Enhanced video data for detailed view
export interface VideoDetails extends Video {
  transcript?: string;
  chapters?: VideoChapter[];
  relatedVideos?: Video[];
  comments: Comment[];
  prerequisiteAnalysis: PrerequisiteAnalysis;
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface PrerequisiteAnalysis {
  suggestedPrerequisites: string[];
  confidence: number; // 0-1 scale
  keywordMatches: string[];
  recommendedOrder: string[];
}

export interface SpiceRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}