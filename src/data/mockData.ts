import { Video, Course, VideoRating } from '../types/index';

// Mock video data
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Quantum Computing',
    description: 'A comprehensive introduction to quantum computing principles, quantum gates, and quantum algorithms. This lecture covers the fundamental concepts needed to understand quantum computation.',
    duration: 3600, // 1 hour
    uploadDate: new Date('2024-10-15'),
    thumbnailUrl: '/thumbnails/quantum-intro.jpg',
    panoptoId: 'panopto-123-456',
    course: 'Physics 347',
    lecturer: 'Dr. Sarah Chen',
    tags: ['quantum', 'physics', 'computing', 'algorithms'],
    averageRating: {
      difficulty: 4,
      importance: 5,
      clarity: 4,
      usefulness: 5
    },
    totalRatings: 87,
    viewCount: 1423
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Basic concepts of machine learning including supervised and unsupervised learning, neural networks, and practical applications in modern technology.',
    duration: 2700, // 45 minutes
    uploadDate: new Date('2024-10-20'),
    thumbnailUrl: '/thumbnails/ml-fundamentals.jpg',
    panoptoId: 'panopto-789-012',
    course: 'Computer Science 421',
    lecturer: 'Prof. Michael Roberts',
    tags: ['machine learning', 'AI', 'neural networks', 'algorithms'],
    averageRating: {
      difficulty: 3,
      importance: 5,
      clarity: 5,
      usefulness: 4
    },
    totalRatings: 156,
    viewCount: 2341
  },
  {
    id: '3',
    title: 'Advanced Calculus - Multivariable Functions',
    description: 'Deep dive into multivariable calculus, partial derivatives, multiple integrals, and vector calculus applications in engineering and physics.',
    duration: 4200, // 70 minutes
    uploadDate: new Date('2024-10-18'),
    thumbnailUrl: '/thumbnails/calculus-advanced.jpg',
    panoptoId: 'panopto-345-678',
    course: 'Mathematics 301',
    lecturer: 'Dr. Emily Watson',
    tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
    averageRating: {
      difficulty: 5,
      importance: 4,
      clarity: 3,
      usefulness: 4
    },
    totalRatings: 92,
    viewCount: 1205
  },
  {
    id: '4',
    title: 'Organic Chemistry Reactions',
    description: 'Comprehensive overview of organic chemistry reaction mechanisms, including substitution, elimination, and addition reactions with practical examples.',
    duration: 3300, // 55 minutes
    uploadDate: new Date('2024-10-22'),
    thumbnailUrl: '/thumbnails/organic-chem.jpg',
    panoptoId: 'panopto-901-234',
    course: 'Chemistry 252',
    lecturer: 'Prof. James Liu',
    tags: ['chemistry', 'organic', 'reactions', 'mechanisms'],
    averageRating: {
      difficulty: 4,
      importance: 4,
      clarity: 4,
      usefulness: 5
    },
    totalRatings: 73,
    viewCount: 987
  },
  {
    id: '5',
    title: 'Thermodynamics and Statistical Mechanics',
    description: 'Introduction to thermodynamics laws, entropy, statistical mechanics, and their applications in understanding macroscopic systems from microscopic behavior.',
    duration: 3900, // 65 minutes
    uploadDate: new Date('2024-10-25'),
    thumbnailUrl: '/thumbnails/thermodynamics.jpg',
    panoptoId: 'panopto-567-890',
    course: 'Physics 378',
    lecturer: 'Dr. Sarah Chen',
    tags: ['thermodynamics', 'physics', 'entropy', 'statistics'],
    averageRating: {
      difficulty: 5,
      importance: 4,
      clarity: 3,
      usefulness: 4
    },
    totalRatings: 64,
    viewCount: 834
  },
  {
    id: '6',
    title: 'Data Structures and Algorithms',
    description: 'Essential data structures including trees, graphs, hash tables, and fundamental algorithms for sorting, searching, and optimization problems.',
    duration: 3000, // 50 minutes
    uploadDate: new Date('2024-10-28'),
    thumbnailUrl: '/thumbnails/data-structures.jpg',
    panoptoId: 'panopto-123-789',
    course: 'Computer Science 201',
    lecturer: 'Dr. Alex Kumar',
    tags: ['algorithms', 'data structures', 'programming', 'computer science'],
    averageRating: {
      difficulty: 3,
      importance: 5,
      clarity: 5,
      usefulness: 5
    },
    totalRatings: 203,
    viewCount: 3456
  }
];

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: 'phys-347',
    name: 'Quantum Mechanics and Computing',
    code: 'Physics 347',
    department: 'Physics',
    semester: 'Fall 2024',
    lecturers: ['Dr. Sarah Chen'],
    videos: ['1', '5']
  },
  {
    id: 'cs-421',
    name: 'Artificial Intelligence',
    code: 'Computer Science 421',
    department: 'Computing',
    semester: 'Fall 2024',
    lecturers: ['Prof. Michael Roberts'],
    videos: ['2']
  },
  {
    id: 'math-301',
    name: 'Advanced Calculus',
    code: 'Mathematics 301',
    department: 'Mathematics',
    semester: 'Fall 2024',
    lecturers: ['Dr. Emily Watson'],
    videos: ['3']
  },
  {
    id: 'chem-252',
    name: 'Organic Chemistry II',
    code: 'Chemistry 252',
    department: 'Chemistry',
    semester: 'Fall 2024',
    lecturers: ['Prof. James Liu'],
    videos: ['4']
  },
  {
    id: 'cs-201',
    name: 'Fundamentals of Programming',
    code: 'Computer Science 201',
    department: 'Computing',
    semester: 'Fall 2024',
    lecturers: ['Dr. Alex Kumar'],
    videos: ['6']
  }
];

// Mock video ratings
export const mockVideoRatings: VideoRating[] = [
  {
    id: 'rating-1',
    videoId: '1',
    rating: {
      difficulty: 4,
      importance: 5,
      clarity: 4,
      usefulness: 5
    },
    comment: 'Excellent introduction to quantum computing concepts. Very clear explanations!',
    timestamp: new Date('2024-10-16')
  },
  {
    id: 'rating-2',
    videoId: '2',
    rating: {
      difficulty: 3,
      importance: 5,
      clarity: 5,
      usefulness: 4
    },
    comment: 'Great fundamentals lecture, helped me understand ML basics.',
    timestamp: new Date('2024-10-21')
  }
];

// Mock statistics
export const mockStats = {
  totalVideos: 156,
  totalRatings: 1247,
  averageRating: 4.2,
  totalViews: 12567,
  mostPopularCourse: 'Computer Science 421',
  spiciestVideo: 'Advanced Calculus - Multivariable Functions',
  easiestVideo: 'Introduction to Programming Basics'
};

// Helper functions
export const getVideoById = (id: string): Video | undefined => {
  return mockVideos.find(video => video.id === id);
};

export const getVideosByCourse = (courseCode: string): Video[] => {
  return mockVideos.filter(video => video.course === courseCode);
};

export const getVideosByLecturer = (lecturer: string): Video[] => {
  return mockVideos.filter(video => video.lecturer === lecturer);
};

export const getPopularVideos = (limit = 10): Video[] => {
  return mockVideos
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

export const getHighestRatedVideos = (limit = 10): Video[] => {
  return mockVideos
    .sort((a, b) => {
      const avgA = (a.averageRating.difficulty + a.averageRating.importance + 
                   a.averageRating.clarity + a.averageRating.usefulness) / 4;
      const avgB = (b.averageRating.difficulty + b.averageRating.importance + 
                   b.averageRating.clarity + b.averageRating.usefulness) / 4;
      return avgB - avgA;
    })
    .slice(0, limit);
};