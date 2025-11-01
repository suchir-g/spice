import { populateFirebaseWithMockData, quickPopulate, largePopulate } from './populateFirebase';

// Make functions available globally for console access
(window as any).populateFirebase = {
  // Quick populate - 50 videos with ~10 ratings each
  quick: async () => {
    console.log('🚀 Starting quick populate...');
    try {
      const result = await quickPopulate();
      console.log('✅ Quick populate completed!', result);
      return result;
    } catch (error) {
      console.error('❌ Quick populate failed:', error);
      throw error;
    }
  },

  // Large populate - 200 videos with ~20 ratings each  
  large: async () => {
    console.log('🚀 Starting large populate...');
    console.log('⚠️  This will take several minutes and make many Firebase writes!');
    try {
      const result = await largePopulate();
      console.log('✅ Large populate completed!', result);
      return result;
    } catch (error) {
      console.error('❌ Large populate failed:', error);
      throw error;
    }
  },

  // Custom populate
  custom: async (videoCount: number, ratingsPerVideo: number) => {
    console.log(`🚀 Starting custom populate with ${videoCount} videos and ~${ratingsPerVideo} ratings each...`);
    try {
      const result = await populateFirebaseWithMockData(videoCount, ratingsPerVideo);
      console.log('✅ Custom populate completed!', result);
      return result;
    } catch (error) {
      console.error('❌ Custom populate failed:', error);
      throw error;
    }
  }
};

console.log('🔥 Firebase population tools loaded!');
console.log('📋 Available commands:');
console.log('   populateFirebase.quick() - Add 50 videos with ~10 ratings each');
console.log('   populateFirebase.large() - Add 200 videos with ~20 ratings each');
console.log('   populateFirebase.custom(videoCount, ratingsPerVideo) - Custom amount');
console.log('');
console.log('💡 Example: populateFirebase.quick()');
console.log('⚠️  Make sure your Firebase is configured before running!');

export {}; // Make this a module