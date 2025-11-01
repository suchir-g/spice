import { Video, Rating } from '../types/index';

// Panopto API configuration
const PANOPTO_CONFIG = {
  // Imperial College Panopto server URL
  serverUrl: 'https://imperial.cloud.panopto.eu',
  // Your Panopto API credentials
  clientId: 'dfd83afb-7734-4c40-8f99-b38800f0e3b8',
  clientSecret: 'zVi2U2C4ypIOfR0jblD+eN/dscbGjY62wpvSAmqdew4=',
  // Common folder IDs you might want to query
  folderIds: {
    // Add your specific folder IDs here
    // e.g., 'computer-science': 'folder-id-123',
  }
};

interface PanoptoSession {
  Id: string;
  Name: string;
  Description?: string;
  Duration: number;
  CreatedDate: string;
  FolderName: string;
  CreatorDisplayName: string;
  ViewerUrl: string;
  ThumbnailUrl: string;
  DeliveryId: string;
  // Add more fields as needed
}

interface PanoptoResponse {
  Results: PanoptoSession[];
  TotalNumberOfResults: number;
}

class PanoptoService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  // Get OAuth access token
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${PANOPTO_CONFIG.serverUrl}/Panopto/oauth2/connect/token`;
    
    // Basic Auth approach for Server Application
    const credentials = btoa(`${PANOPTO_CONFIG.clientId}:${PANOPTO_CONFIG.clientSecret}`);
    
    console.log('🔑 Attempting Panopto OAuth with Basic Auth...');
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    });

    console.log('📡 OAuth response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OAuth failed:', response.status, errorText);
      throw new Error(`Failed to get Panopto access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early

    return this.accessToken!;
  }

  // Make authenticated API request
  private async apiRequest(endpoint: string, params?: Record<string, string>): Promise<any> {
    const token = await this.getAccessToken();
    const url = new URL(`${PANOPTO_CONFIG.serverUrl}/Panopto/api/v1/${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Panopto API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get sessions (videos) from a specific folder
  async getSessionsFromFolder(folderId: string, maxResults: number = 50): Promise<Video[]> {
    try {
      const params = {
        folderId,
        maxResults: maxResults.toString(),
        sortField: 'Created',
        sortOrder: 'Desc'
      };

      const data: PanoptoResponse = await this.apiRequest('sessions', params);
      
      return data.Results.map(session => this.convertPanoptoToVideo(session));
    } catch (error) {
      console.error('Error fetching Panopto sessions:', error);
      return [];
    }
  }

  // Search for sessions by query
  async searchSessions(query: string, maxResults: number = 50): Promise<Video[]> {
    try {
      const params = {
        searchQuery: query,
        maxResults: maxResults.toString(),
        sortField: 'Relevance',
        sortOrder: 'Desc'
      };

      const data: PanoptoResponse = await this.apiRequest('sessions/search', params);
      
      return data.Results.map(session => this.convertPanoptoToVideo(session));
    } catch (error) {
      console.error('Error searching Panopto sessions:', error);
      return [];
    }
  }

  // Get all sessions from configured folders
  async getAllSessions(maxResults: number = 100): Promise<Video[]> {
    const allVideos: Video[] = [];
    
    try {
      // If no specific folders configured, get recent sessions
      if (Object.keys(PANOPTO_CONFIG.folderIds).length === 0) {
        const params = {
          maxResults: maxResults.toString(),
          sortField: 'Created',
          sortOrder: 'Desc'
        };

        const data: PanoptoResponse = await this.apiRequest('sessions', params);
        return data.Results.map(session => this.convertPanoptoToVideo(session));
      }

      // Otherwise, get from each configured folder
      const folderPromises = Object.entries(PANOPTO_CONFIG.folderIds).map(
        async ([folderName, folderId]) => {
          const sessions = await this.getSessionsFromFolder(folderId as string, maxResults);
          return sessions.map(video => ({
            ...video,
            course: folderName // Use folder name as course
          }));
        }
      );

      const folderResults = await Promise.all(folderPromises);
      folderResults.forEach(videos => allVideos.push(...videos));

      return allVideos;
    } catch (error) {
      console.error('Error fetching all Panopto sessions:', error);
      return [];
    }
  }

  // Convert Panopto session to our Video format
  private convertPanoptoToVideo(session: PanoptoSession): Video {
    return {
      id: session.Id,
      title: session.Name,
      description: session.Description || '',
      duration: session.Duration, // Keep as seconds (number)
      uploadDate: new Date(session.CreatedDate),
      thumbnailUrl: session.ThumbnailUrl || '/placeholder-video.jpg',
      panoptoId: session.Id,
      course: session.FolderName,
      lecturer: session.CreatorDisplayName,
      tags: [], // Initialize empty - can be populated later
      averageRating: {
        difficulty: 0,
        importance: 0,
        clarity: 0,
        usefulness: 0
      } as Rating,
      totalRatings: 0,
      viewCount: 0 // Initialize to 0 - can be populated from analytics if available
    };
  }

  // Format duration from seconds to readable string
  private formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Get direct embed URL for a session
  getEmbedUrl(sessionId: string): string {
    return `${PANOPTO_CONFIG.serverUrl}/Panopto/Pages/Embed.aspx?id=${sessionId}`;
  }
}

export const panoptoService = new PanoptoService();
export default PanoptoService;