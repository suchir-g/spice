import { panoptoService } from '../services/panopto';

// Simple test function to verify Panopto connection
export const testPanoptoConnection = async () => {
  console.log('🧪 Testing Panopto connection...');
  
  try {
    // Test 1: Get access token
    console.log('📡 Step 1: Getting OAuth token...');
    
    // Test 2: Fetch a few sessions
    console.log('📹 Step 2: Fetching sample videos...');
    const videos = await panoptoService.getAllSessions(5);
    
    if (videos.length > 0) {
      console.log(`✅ Success! Found ${videos.length} videos:`);
      videos.forEach((video, index) => {
        console.log(`${index + 1}. "${video.title}" by ${video.lecturer}`);
        console.log(`   Course: ${video.course}`);
        console.log(`   Duration: ${Math.floor(video.duration / 60)}m`);
        console.log(`   Upload Date: ${video.uploadDate.toLocaleDateString()}`);
        console.log(`   Panopto URL: ${panoptoService.getEmbedUrl(video.id)}`);
        console.log('---');
      });
      return { success: true, videoCount: videos.length, videos };
    } else {
      console.log('⚠️ No videos found. This could mean:');
      console.log('- Your credentials don\'t have access to any folders');
      console.log('- The server has no public videos');
      console.log('- There might be permission issues');
      return { success: true, videoCount: 0, videos: [] };
    }
    
  } catch (error) {
    console.error('❌ Panopto test failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to get Panopto access token')) {
        console.error('🔑 OAuth Error: Check your Client ID and Client Secret');
      } else if (error.message.includes('API error: 401')) {
        console.error('🚫 Authentication Error: Your credentials may be invalid');
      } else if (error.message.includes('API error: 403')) {
        console.error('🚫 Permission Error: Your app may not have the required permissions');
      } else if (error.message.includes('API error: 404')) {
        console.error('🔍 Not Found: The endpoint may not exist or you may not have access');
      }
    }
    
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Test search functionality
export const testPanoptoSearch = async (query: string = 'lecture') => {
  console.log(`🔍 Testing Panopto search for "${query}"...`);
  
  try {
    const results = await panoptoService.searchSessions(query, 3);
    console.log(`✅ Search returned ${results.length} results`);
    
    results.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}"`);
    });
    
    return { success: true, results };
  } catch (error) {
    console.error('❌ Search test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testPanopto = testPanoptoConnection;
  (window as any).testPanoptoSearch = testPanoptoSearch;
}