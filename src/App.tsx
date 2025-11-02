import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import VideoDetails from './pages/VideoDetails/VideoDetails';
import TestPage from './pages/TestPage/TestPage';
import './utils/testPanopto'; // Load test functions for console access
import './utils/firebasePopulator'; // Load Firebase population tools for console access
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video/:videoId" element={<VideoDetails />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;