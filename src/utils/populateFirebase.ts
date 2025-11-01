import { firebaseService } from '../services/firebaseService';
import { Video, Rating } from '../types/index';

// Mock data arrays for generating realistic content
const COURSES = [
  'Mathematics', 'Physics', 'Computer Science', 'Engineering', 'Chemistry', 
  'Biology', 'Economics', 'Business', 'Medicine', 'Psychology',
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
  'Software Engineering', 'Data Science', 'Machine Learning', 'AI',
  'Quantum Physics', 'Organic Chemistry', 'Molecular Biology',
  'Statistics', 'Calculus', 'Linear Algebra', 'Differential Equations',
  'Thermodynamics', 'Fluid Mechanics', 'Materials Science'
];

const LECTURERS = [
  'Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez', 
  'Prof. James Wilson', 'Dr. Anna Thompson', 'Prof. David Kumar',
  'Dr. Lisa Wang', 'Prof. Robert Garcia', 'Dr. Jennifer Lee',
  'Prof. Christopher Brown', 'Dr. Maria Santos', 'Prof. Ahmed Hassan',
  'Dr. Catherine Miller', 'Prof. Thomas Anderson', 'Dr. Rachel Green',
  'Prof. Daniel Martinez', 'Dr. Sophie Turner', 'Prof. Mark Davis',
  'Dr. Isabella Clark', 'Prof. Jonathan White', 'Dr. Olivia Taylor',
  'Prof. Alexander Moore', 'Dr. Grace Kim', 'Prof. Benjamin Wright'
];

const TAGS = [
  'advanced', 'beginner', 'intermediate', 'theory', 'practical', 
  'lab work', 'tutorial', 'lecture', 'seminar', 'workshop',
  'problem solving', 'research', 'experimental', 'computational',
  'mathematical', 'analytical', 'design', 'programming',
  'simulation', 'modeling', 'optimization', 'algorithms',
  'data analysis', 'visualization', 'presentation', 'group work',
  'individual', 'project', 'assessment', 'exam prep',
  'fundamentals', 'applications', 'case study', 'real world'
];

const VIDEO_TITLES = [
  'Introduction to {course}',
  'Advanced {course} Concepts',
  'Fundamentals of {course}',
  '{course} Applications in Industry',
  'Problem Solving in {course}',
  'Laboratory Techniques for {course}',
  'Mathematical Foundations of {course}',
  'Current Research in {course}',
  'Case Studies in {course}',
  'Experimental Methods in {course}',
  'Computational Approaches to {course}',
  'Design Principles in {course}',
  'Analysis Techniques for {course}',
  'Modern Developments in {course}',
  'Practical Applications of {course}',
  'Theory and Practice of {course}',
  'Advanced Topics in {course}',
  'Research Methods in {course}',
  'Data Analysis for {course}',
  'Project Work in {course}'
];

const DESCRIPTIONS = [
  'This lecture covers the fundamental principles and key concepts.',
  'An in-depth exploration of advanced topics and recent developments.',
  'Practical applications and real-world examples are discussed.',
  'Laboratory techniques and experimental methods are demonstrated.',
  'Problem-solving strategies and analytical approaches are presented.',
  'Current research trends and future directions are examined.',
  'Mathematical foundations and theoretical frameworks are explained.',
  'Case studies from industry and academic research are analyzed.',
  'Computational methods and simulation techniques are introduced.',
  'Design principles and engineering applications are covered.',
  'Data analysis methods and statistical approaches are taught.',
  'Group projects and collaborative work are emphasized.',
  'Assessment strategies and exam preparation techniques are discussed.',
  'Interactive learning and student participation are encouraged.'
];

// Utility functions
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate a realistic rating
function generateRating(): Rating {
  // Create some correlation between ratings (good lectures tend to be good across all metrics)
  const baseQuality = randomFloat(2, 5);
  const variance = 0.8;
  
  return {
    difficulty: Math.max(1, Math.min(5, baseQuality + randomFloat(-variance, variance))),
    importance: Math.max(1, Math.min(5, baseQuality + randomFloat(-variance, variance))),
    clarity: Math.max(1, Math.min(5, baseQuality + randomFloat(-variance, variance))),
    usefulness: Math.max(1, Math.min(5, baseQuality + randomFloat(-variance, variance)))
  };
}

// Generate a mock video
function generateMockVideo(id: string): Video {
  const course = randomChoice(COURSES);
  const lecturer = randomChoice(LECTURERS);
  const titleTemplate = randomChoice(VIDEO_TITLES);
  const title = titleTemplate.replace('{course}', course);
  
  return {
    id,
    title,
    lecturer,
    course,
    description: randomChoice(DESCRIPTIONS),
    duration: randomInt(900, 7200), // 15 to 120 minutes in seconds
    uploadDate: randomDate(new Date(2023, 0, 1), new Date()),
    thumbnailUrl: `https://via.placeholder.com/320x180?text=${encodeURIComponent(title.substring(0, 20))}`,
    panoptoId: id,
    tags: randomChoices(TAGS, randomInt(3, 8)),
    averageRating: {
      difficulty: 0,
      importance: 0,
      clarity: 0,
      usefulness: 0
    },
    totalRatings: 0,
    viewCount: randomInt(0, 500)
  };
}

// Generate mock user IDs
function generateUserId(): string {
  const adjectives = ['happy', 'clever', 'bright', 'curious', 'eager', 'focused', 'keen', 'smart'];
  const nouns = ['student', 'learner', 'scholar', 'researcher', 'engineer', 'scientist', 'analyst'];
  return `${randomChoice(adjectives)}_${randomChoice(nouns)}_${randomInt(100, 999)}`;
}

// Main function to populate Firebase
export async function populateFirebaseWithMockData(videoCount: number = 100, ratingsPerVideo: number = 15) {
  console.log(`Starting to populate Firebase with ${videoCount} videos and ~${ratingsPerVideo} ratings each...`);
  
  try {
    // Generate mock videos
    const videos: Video[] = [];
    for (let i = 0; i < videoCount; i++) {
      const videoId = `mock-video-${String(i + 1).padStart(3, '0')}`;
      videos.push(generateMockVideo(videoId));
    }
    
    console.log(`Generated ${videos.length} mock videos`);
    
    // Save videos to Firebase
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      try {
        await firebaseService.saveVideo(video);
        console.log(`Saved video ${i + 1}/${videos.length}: ${video.title}`);
      } catch (error) {
        console.error(`Error saving video ${video.title}:`, error);
      }
      
      // Add some delay to avoid overwhelming Firebase
      if (i % 10 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('All videos saved! Now adding ratings...');
    
    // Generate ratings for each video
    let totalRatings = 0;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const numRatings = randomInt(5, ratingsPerVideo * 2); // Variable number of ratings
      
      console.log(`Adding ${numRatings} ratings for video ${i + 1}/${videos.length}: ${video.title}`);
      
      for (let j = 0; j < numRatings; j++) {
        try {
          const rating = generateRating();
          const userId = generateUserId();
          
          await firebaseService.addRating(video.id, rating, userId);
          totalRatings++;
          
          // Small delay between ratings
          if (j % 5 === 0 && j > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Error adding rating ${j + 1} for video ${video.title}:`, error);
        }
      }
      
      // Longer delay between videos
      if (i % 5 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Progress: ${i + 1}/${videos.length} videos processed, ${totalRatings} total ratings added`);
      }
    }
    
    console.log(`🎉 Successfully populated Firebase with:`);
    console.log(`   📹 ${videos.length} videos`);
    console.log(`   ⭐ ${totalRatings} ratings`);
    console.log(`   📊 Average ${(totalRatings / videos.length).toFixed(1)} ratings per video`);
    
    return {
      videos: videos.length,
      ratings: totalRatings,
      success: true
    };
    
  } catch (error) {
    console.error('Error populating Firebase:', error);
    throw error;
  }
}

// Quick populate function with default values
export async function quickPopulate() {
  return await populateFirebaseWithMockData(50, 10); // 50 videos, ~10 ratings each
}

// Large populate function for extensive testing
export async function largePopulate() {
  return await populateFirebaseWithMockData(200, 20); // 200 videos, ~20 ratings each
}

// Helper function to clear all mock data (use carefully!)
export async function clearMockData() {
  console.log('⚠️  This function would clear mock data - implement with caution!');
  console.log('You would need to implement Firestore batch deletes here.');
  console.log('For now, you can delete the data manually from Firebase Console.');
}