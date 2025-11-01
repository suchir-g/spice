import { panoptoService } from './panopto';
import { firebaseService } from './firebaseService';
import { Video, Rating } from '../types/index';

class VideoService {
  // Get videos from Firebase only (Panopto disabled)
  async getVideos(maxResults: number = 50, useCache: boolean = true): Promise<Video[]> {
    try {
      console.log('Fetching videos from Firebase...');
      
      // Get videos from Firebase with pagination
      const result = await this.getAllVideosFromFirebase(maxResults);
      
      if (result.videos.length === 0) {
        console.log('No videos found in Firebase. Run populateFirebase.quick() to add mock data!');
        return [];
      }
      
      console.log(`Found ${result.videos.length} videos from Firebase`);
      
      return result.videos;
      
    } catch (error) {
      console.error('Error in getVideos:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  // Helper method to get videos from Firebase with pagination
  private async getAllVideosFromFirebase(pageSize: number = 20, lastDoc?: any): Promise<{ videos: Video[], lastDoc: any, hasMore: boolean }> {
    try {
      const { collection, getDocs, query, orderBy, limit, startAfter } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      
      // Build query with proper ordering and pagination
      let videosQuery = query(
        collection(db, 'videos'), 
        orderBy('uploadDate', 'desc'),
        limit(pageSize + 1) // Get one extra to check if there are more
      );
      
      // If we have a last document, start after it for pagination
      if (lastDoc) {
        videosQuery = query(
          collection(db, 'videos'), 
          orderBy('uploadDate', 'desc'),
          startAfter(lastDoc),
          limit(pageSize + 1)
        );
      }
      
      const snapshot = await getDocs(videosQuery);
      const allDocs = snapshot.docs;
      
      // Check if there are more results
      const hasMore = allDocs.length > pageSize;
      const videoDocs = hasMore ? allDocs.slice(0, pageSize) : allDocs;
      
      const videos = videoDocs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadDate: data.uploadDate.toDate ? data.uploadDate.toDate() : new Date(data.uploadDate)
        } as Video;
      });
      
      const lastDocument = videoDocs[videoDocs.length - 1];
      
      console.log(`🔍 Firebase query: ${videoDocs.length}/${allDocs.length} docs, hasMore: ${hasMore}`);
      
      return {
        videos,
        lastDoc: lastDocument,
        hasMore
      };
      
    } catch (error) {
      console.error('❌ Error fetching videos from Firebase:', error);
      return { videos: [], lastDoc: null, hasMore: false };
    }
  }

  // Get total video count for better UX
  async getTotalVideoCount(): Promise<number> {
    try {
      const { collection, getCountFromServer } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      
      const snapshot = await getCountFromServer(collection(db, 'videos'));
      const count = snapshot.data().count;
      
      console.log(`📊 Total videos in Firebase: ${count}`);
      return count;
    } catch (error) {
      console.error('Error getting video count:', error);
      return 0;
    }
  }

  // Get videos with lazy loading support
  async getVideosPaginated(pageSize: number = 20, lastDoc?: any): Promise<{ videos: Video[], lastDoc: any, hasMore: boolean }> {
    try {
      console.log(`Fetching ${pageSize} videos from Firebase${lastDoc ? ' (continuing pagination)' : ' (initial load)'}...`);
      const startTime = performance.now();
      
      const result = await this.getAllVideosFromFirebase(pageSize, lastDoc);
      
      const endTime = performance.now();
      console.log(`✅ Fetched ${result.videos.length} videos in ${Math.round(endTime - startTime)}ms`);
      console.log(`📊 Pagination status: hasMore=${result.hasMore}, lastDoc=${result.lastDoc ? 'exists' : 'null'}`);
      
      return result;
    } catch (error) {
      console.error('❌ Error in getVideosPaginated:', error);
      return { videos: [], lastDoc: null, hasMore: false };
    }
  }

  // Search videos in Firebase only
  async searchVideos(query: string): Promise<Video[]> {
    try {
      console.log(`Searching videos in Firebase for: "${query}"`);
      
      // Get all videos from Firebase and search locally (for now, get more for search)
      const result = await this.getAllVideosFromFirebase(100);
      
      if (result.videos.length === 0) {
        console.log('No videos in Firebase to search. Run populateFirebase.quick() to add mock data!');
        return [];
      }
      
      // Simple client-side search
      const searchLower = query.toLowerCase();
      const searchResults = result.videos.filter((video: Video) =>
        video.title.toLowerCase().includes(searchLower) ||
        video.lecturer.toLowerCase().includes(searchLower) ||
        video.course.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
      
      console.log(`Found ${searchResults.length} matching videos`);
      return searchResults;
      
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }

  // Get a single video from Firebase
  async getVideo(videoId: string): Promise<Video | null> {
    try {
      console.log(`Getting video ${videoId} from Firebase...`);
      
      // Get video from Firebase
      let video = await firebaseService.getVideoWithRatings(videoId);
      
      if (!video) {
        console.log(`Video ${videoId} not found in Firebase`);
        return null;
      }
      
      // Increment view count
      await firebaseService.incrementViewCount(videoId);
      video.viewCount += 1;
      
      return video;
      
    } catch (error) {
      console.error('Error getting video:', error);
      return null;
    }
  }

  // Add a rating to a video
  async rateVideo(videoId: string, rating: Rating, userId?: string): Promise<void> {
    try {
      await firebaseService.addRating(videoId, rating, userId);
      console.log(`Rating added for video ${videoId}`);
    } catch (error) {
      console.error('Error rating video:', error);
      throw error;
    }
  }

  // Get placeholder embed URL (Panopto disabled)
  getEmbedUrl(videoId: string): string {
    return `https://via.placeholder.com/800x450?text=Video+${videoId}+Placeholder`;
  }

  // Test Firebase connection instead of Panopto
  async testFirebaseConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase connection...');
      const result = await this.getAllVideosFromFirebase(1);
      console.log(`Firebase connection successful! Found ${result.videos.length} videos.`);
      return true;
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  }
}

export const videoService = new VideoService();
export default VideoService;