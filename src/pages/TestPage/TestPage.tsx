import React, { useState } from 'react';
import { videoService } from '../../services/videoService';
import { Video } from '../../types/index';
import './TestPage.css';

const TestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);

  const runTest = async () => {
    setIsLoading(true);
    setStatus('Testing connection...');
    
    try {
      const testVideos = await videoService.getVideos(3);
      setVideos(testVideos);
      setStatus(`✅ Found ${testVideos.length} videos`);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Connection failed'}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="test-page">
      <div className="test-container">
        <h1>Spice Test</h1>
        
        <button 
          onClick={runTest}
          disabled={isLoading}
          className="test-button"
        >
          {isLoading ? 'Testing...' : 'Test Panopto Connection'}
        </button>
        
        {status && (
          <div className={`status ${status.includes('❌') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}
        
        {videos.length > 0 && (
          <div className="results">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <h3>{video.title}</h3>
                <p>{video.lecturer} • {video.course}</p>
                <a 
                  href={videoService.getEmbedUrl(video.id)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Open in Panopto →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;