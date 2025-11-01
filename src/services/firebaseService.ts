import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  setDoc,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Video, Rating, VideoRating } from '../types/index';

// Collection names
const COLLECTIONS = {
  VIDEOS: 'videos',
  RATINGS: 'ratings',
  VIDEO_STATS: 'video-stats'
};

interface VideoStats {
  videoId: string;
  totalRatings: number;
  averageRating: Rating;
  viewCount: number;
  lastUpdated: Date;
}

class FirebaseService {
  // Save a new video to Firebase (when first loaded from Panopto)
  async saveVideo(video: Video): Promise<void> {
    try {
      const videoRef = doc(db, COLLECTIONS.VIDEOS, video.id);
      await setDoc(videoRef, {
        ...video,
        uploadDate: video.uploadDate,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Initialize video stats
      const statsRef = doc(db, COLLECTIONS.VIDEO_STATS, video.id);
      await setDoc(statsRef, {
        videoId: video.id,
        totalRatings: 0,
        averageRating: {
          difficulty: 0,
          importance: 0,
          clarity: 0,
          usefulness: 0
        },
        viewCount: 0,
        lastUpdated: new Date()
      });
      
      console.log('Video saved to Firebase:', video.id);
    } catch (error) {
      console.error('Error saving video to Firebase:', error);
      throw error;
    }
  }

  // Add a rating for a video
  async addRating(videoId: string, rating: Rating, userId?: string): Promise<void> {
    try {
      // Add the rating document
      const ratingData = {
        videoId,
        rating,
        userId: userId || 'anonymous',
        timestamp: new Date()
      };
      
      await addDoc(collection(db, COLLECTIONS.RATINGS), ratingData);
      
      // Update video statistics
      await this.updateVideoStats(videoId);
      
      console.log('Rating added for video:', videoId);
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  // Update video statistics after new rating
  private async updateVideoStats(videoId: string): Promise<void> {
    try {
      // Get all ratings for this video
      const ratingsQuery = query(
        collection(db, COLLECTIONS.RATINGS),
        where('videoId', '==', videoId)
      );
      
      const ratingsSnapshot = await getDocs(ratingsQuery);
      const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating as Rating);
      
      if (ratings.length === 0) return;
      
      // Calculate average ratings
      const averageRating: Rating = {
        difficulty: ratings.reduce((sum, r) => sum + r.difficulty, 0) / ratings.length,
        importance: ratings.reduce((sum, r) => sum + r.importance, 0) / ratings.length,
        clarity: ratings.reduce((sum, r) => sum + r.clarity, 0) / ratings.length,
        usefulness: ratings.reduce((sum, r) => sum + r.usefulness, 0) / ratings.length,
      };
      
      // Update stats document
      const statsRef = doc(db, COLLECTIONS.VIDEO_STATS, videoId);
      await updateDoc(statsRef, {
        totalRatings: ratings.length,
        averageRating,
        lastUpdated: new Date()
      });
      
      // Update video document
      const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
      await updateDoc(videoRef, {
        averageRating,
        totalRatings: ratings.length,
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error('Error updating video stats:', error);
      throw error;
    }
  }

  // Get video with ratings from Firebase
  async getVideoWithRatings(videoId: string): Promise<Video | null> {
    try {
      const videoDoc = await getDoc(doc(db, COLLECTIONS.VIDEOS, videoId));
      
      if (!videoDoc.exists()) {
        return null;
      }
      
      const videoData = videoDoc.data();
      return {
        ...videoData,
        id: videoDoc.id,
        uploadDate: videoData.uploadDate.toDate()
      } as Video;
      
    } catch (error) {
      console.error('Error getting video from Firebase:', error);
      return null;
    }
  }

  // Get multiple videos with their ratings
  async getVideosWithRatings(videoIds: string[]): Promise<Video[]> {
    try {
      const videos: Video[] = [];
      
      // Process in batches (Firestore has a limit of 10 for 'in' queries)
      const batchSize = 10;
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        
        const videosQuery = query(
          collection(db, COLLECTIONS.VIDEOS),
          where('__name__', 'in', batch)
        );
        
        const snapshot = await getDocs(videosQuery);
        const batchVideos = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          uploadDate: doc.data().uploadDate.toDate()
        })) as Video[];
        
        videos.push(...batchVideos);
      }
      
      return videos;
    } catch (error) {
      console.error('Error getting videos from Firebase:', error);
      return [];
    }
  }

  // Increment view count for a video
  async incrementViewCount(videoId: string): Promise<void> {
    try {
      const statsRef = doc(db, COLLECTIONS.VIDEO_STATS, videoId);
      const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
      
      await Promise.all([
        updateDoc(statsRef, {
          viewCount: increment(1),
          lastUpdated: new Date()
        }),
        updateDoc(videoRef, {
          viewCount: increment(1),
          updatedAt: new Date()
        })
      ]);
      
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error for view count - it's not critical
    }
  }

  // Get recent ratings for analytics
  async getRecentRatings(limitCount: number = 50): Promise<VideoRating[]> {
    try {
      const ratingsQuery = query(
        collection(db, COLLECTIONS.RATINGS),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(ratingsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as VideoRating[];
      
    } catch (error) {
      console.error('Error getting recent ratings:', error);
      return [];
    }
  }

  // Search videos by title, lecturer, or course
  async searchVideos(searchQuery: string): Promise<Video[]> {
    try {
      // Note: Firestore doesn't have full-text search, so this is a basic implementation
      // For production, you might want to use Algolia or implement search with Cloud Functions
      
      const videosQuery = query(collection(db, COLLECTIONS.VIDEOS));
      const snapshot = await getDocs(videosQuery);
      
      const allVideos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        uploadDate: doc.data().uploadDate.toDate()
      })) as Video[];
      
      // Simple client-side filtering
      const searchLower = searchQuery.toLowerCase();
      return allVideos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.lecturer.toLowerCase().includes(searchLower) ||
        video.course.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
      );
      
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
export default FirebaseService;