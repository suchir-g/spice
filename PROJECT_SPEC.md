# Spice - Lecture Rating and Recommendation Platform

## Project Overview

**Spice** is a React-based web application that integrates with Panopto (Imperial College's video recording software) to allow students to rate lecture videos and receive personalized recommendations based on content importance and peer engagement.

## Core Features

### Phase 1 - MVP (Minimum Viable Product)

#### 1. User Authentication & Management
- **Optional Firebase Authentication**
  - Anonymous users can browse and rate content
  - Optional account creation for personalized recommendations
  - Simple session persistence

#### 2. Panopto Integration
- **API Integration**
  - Connect to Panopto REST API
  - Fetch user's enrolled courses and available videos
  - Retrieve video metadata (title, duration, upload date, course)
  - Handle authentication tokens and API rate limits

#### 3. Video Rating System
- **Spice Rating Scale**
  - 5-point rating system (1-5 chili peppers 🌶️)
  - Rating categories:
    - Content Difficulty
    - Importance/Relevance
    - Clarity of Explanation
    - Overall Usefulness
  - Optional text comments
  - Edit/update existing ratings

#### 4. Video Discovery & Listing
- **Course-based Organization**
  - Group videos by enrolled courses
  - Chronological and alphabetical sorting
  - Search functionality (by title, course, lecturer)
  - Filter by rating, date, watched status

#### 5. Recommendation Engine (Basic)
- **Algorithm Components**
  - Average spice ratings across all users
  - Personal rating history and preferences
  - Course relevance and recency
  - Simple collaborative filtering
  - Priority scoring for "must-watch" content

#### 6. User Dashboard
- **Personal Analytics**
  - Watch history and progress tracking
  - Personal rating statistics
  - Recommended videos queue
  - Recently rated content

### Phase 2 - Enhanced Features

#### 1. Advanced Analytics
- **Viewing Heatmaps**
  - Track when users watch specific video segments
  - Identify most-watched portions of lectures
  - Aggregate viewing patterns across users
  - Visual timeline showing peak viewing times

#### 2. Social Features
- **Community Engagement**
  - View aggregated ratings and comments
  - Follow other users' recommendations
  - Study group formation based on viewing patterns
  - Peer rating comparisons

#### 3. Advanced Recommendations
- **Machine Learning Integration**
  - Content-based filtering using video transcripts
  - Temporal patterns in viewing behavior
  - Cross-course recommendation system
  - Exam schedule awareness for priority boosting

#### 4. Lecturer Analytics Dashboard
- **Content Performance Metrics**
  - Video engagement statistics
  - Rating trends and feedback analysis
  - Student viewing pattern insights
  - Content improvement suggestions

## Technical Architecture

### Frontend (React)
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── video/
│   │   ├── VideoCard.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── RatingComponent.jsx
│   │   └── VideoList.jsx
│   ├── dashboard/
│   │   ├── UserDashboard.jsx
│   │   ├── RecommendationPanel.jsx
│   │   └── AnalyticsView.jsx
│   └── common/
│       ├── Header.jsx
│       ├── Navigation.jsx
│       └── LoadingSpinner.jsx
├── services/
│   ├── panoptoAPI.js
│   ├── authService.js
│   ├── ratingsService.js
│   └── recommendationEngine.js
├── hooks/
│   ├── useAuth.js
│   ├── usePanopto.js
│   └── useRecommendations.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
└── styles/
    ├── components/
    └── global.css
```

### Backend Architecture
```
backend/
├── controllers/
│   ├── videoController.js
│   ├── ratingsController.js
│   └── recommendationsController.js
├── services/
│   ├── panoptoService.js
│   ├── firebaseService.js
│   ├── recommendationEngine.js
│   └── analyticsService.js
├── models/
│   ├── Video.js
│   ├── Rating.js
│   └── ViewingSession.js
├── middleware/
│   ├── firebase.js
│   ├── rateLimiting.js
│   └── validation.js
└── routes/
    ├── videos.js
    ├── ratings.js
    └── recommendations.js
```

### Firebase Database Structure

#### Firestore Collections

**Videos Collection** (`/videos/{videoId}`)
```javascript
{
  panoptoId: "string",
  title: "string",
  description: "string",
  duration: "number", // in seconds
  courseId: "string",
  courseName: "string",
  lecturer: "string",
  uploadDate: "timestamp",
  thumbnailUrl: "string",
  videoUrl: "string",
  transcript: "string",
  createdAt: "timestamp",
  // Aggregated rating data
  avgRatings: {
    difficulty: "number",
    importance: "number", 
    clarity: "number",
    overall: "number"
  },
  totalRatings: "number"
}
```

**Ratings Collection** (`/ratings/{ratingId}`)
```javascript
{
  userId: "string", // Firebase Auth UID or anonymous ID
  videoId: "string",
  difficultyRating: "number", // 1-5
  importanceRating: "number", // 1-5
  clarityRating: "number", // 1-5
  overallRating: "number", // 1-5
  comment: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  isAnonymous: "boolean"
}
```

**Viewing Sessions Collection** (`/viewingSessions/{sessionId}`)
```javascript
{
  userId: "string", // Firebase Auth UID or anonymous ID
  videoId: "string",
  startTime: "number", // seconds into video
  endTime: "number", // seconds into video
  sessionStart: "timestamp",
  sessionEnd: "timestamp",
  completed: "boolean",
  isAnonymous: "boolean"
}
```

**User Preferences** (Optional - `/userPreferences/{userId}`)
```javascript
{
  userId: "string",
  favoriteTopics: ["string"],
  ratingHistory: ["string"], // array of rating IDs
  recommendationSettings: {
    includeAnonymousData: "boolean",
    preferredDifficulty: "number"
  },
  createdAt: "timestamp"
}
```

## API Specifications

### Authentication Endpoints (Optional)
- `POST /api/auth/anonymous` - Generate anonymous user session
- `GET /api/auth/status` - Check authentication status
- Firebase Auth handles user registration/login on frontend

### Video Endpoints
- `GET /api/videos` - Get user's available videos (paginated)
- `GET /api/videos/:id` - Get specific video details
- `GET /api/videos/course/:courseId` - Get videos by course
- `GET /api/videos/search?q={query}` - Search videos

### Rating Endpoints
- `POST /api/ratings` - Submit video rating (anonymous or authenticated)
- `GET /api/ratings/video/:videoId` - Get video's aggregated ratings
- `GET /api/ratings/user` - Get current user's ratings (if authenticated)
- `PUT /api/ratings/:id` - Update existing rating

### Recommendation Endpoints
- `GET /api/recommendations` - Get general recommendations for all users
- `GET /api/recommendations/personalized` - Get personalized recommendations (if authenticated)
- `GET /api/recommendations/trending` - Get trending videos
- `GET /api/recommendations/important` - Get high-importance videos

### Analytics Endpoints (Phase 2)
- `POST /api/analytics/viewing` - Track viewing session
- `GET /api/analytics/heatmap/:videoId` - Get video viewing heatmap
- `GET /api/analytics/user-stats` - Get user analytics
- `GET /api/analytics/course-stats/:courseId` - Get course statistics

## Firebase Configuration

### Firebase Services Used
- **Firestore Database**: Store videos, ratings, and viewing sessions
- **Firebase Authentication**: Optional user accounts
- **Firebase Hosting**: Deploy React application
- **Firebase Functions**: Serverless API endpoints (alternative to Express)
- **Firebase Analytics**: Track user engagement

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Videos are readable by everyone
    match /videos/{videoId} {
      allow read: if true;
      allow write: if false; // Only backend can write videos
    }
    
    // Ratings are readable by everyone, writable by anyone
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if true; // Anonymous ratings allowed
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Viewing sessions for analytics
    match /viewingSessions/{sessionId} {
      allow read, write: if true; // Anonymous tracking allowed
    }
    
    // User preferences (only if authenticated)
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Panopto API Integration

### Required Panopto API Endpoints
```javascript
// Authentication
POST /Panopto/oauth2/connect/token

// User Management
GET /Panopto/api/v1/users/me
GET /Panopto/api/v1/users/{userId}/sessions

// Session Management
GET /Panopto/api/v1/sessions
GET /Panopto/api/v1/sessions/{sessionId}
GET /Panopto/api/v1/sessions/search

// Folder Management
GET /Panopto/api/v1/folders
GET /Panopto/api/v1/folders/{folderId}/sessions
```

### Data Synchronization Strategy
- **Scheduled Sync**: Daily sync of new videos and metadata
- **Real-time Updates**: Webhook integration for immediate updates
- **Caching Strategy**: Redis cache for frequently accessed data
- **Rate Limiting**: Respect Panopto API rate limits (implement backoff)

## User Interface Design

### Design System
- **Color Scheme**: 
  - Primary: Imperial Blue (#003E74)
  - Accent: Spice Red (#FF6B35) for ratings
  - Background: Light Gray (#F8F9FA)
  - Text: Dark Gray (#343A40)

- **Typography**: 
  - Headers: Roboto Bold
  - Body: Roboto Regular
  - Code: Fira Code

- **Styling Approach**:
  - Headless UI for accessible, unstyled components
  - CSS Modules for component-scoped styles
  - CSS Custom Properties for design tokens
  - Responsive design with CSS Grid and Flexbox
  - Custom styling on top of Headless UI primitives

### Key UI Components

#### Video Rating Component (with Headless UI)
```jsx
import { Dialog, Transition } from '@headlessui/react'

<Dialog open={isOpen} onClose={setIsOpen}>
  <Dialog.Panel>
    <Dialog.Title>Rate this lecture</Dialog.Title>
    <RatingComponent>
      <SpiceRating category="difficulty" value={3} onChange={handleRating} />
      <SpiceRating category="importance" value={4} onChange={handleRating} />
      <SpiceRating category="clarity" value={5} onChange={handleRating} />
      <SpiceRating category="overall" value={4} onChange={handleRating} />
      <CommentBox placeholder="Additional thoughts..." />
    </RatingComponent>
  </Dialog.Panel>
</Dialog>
```

#### Search and Filters (with Headless UI)
```jsx
import { Combobox, Menu, Listbox } from '@headlessui/react'

<div className="search-controls">
  <Combobox value={searchQuery} onChange={setSearchQuery}>
    <Combobox.Input placeholder="Search lectures..." />
    <Combobox.Options>
      {filteredResults.map((result) => (
        <Combobox.Option key={result.id} value={result}>
          {result.title}
        </Combobox.Option>
      ))}
    </Combobox.Options>
  </Combobox>
  
  <Menu as="div" className="filter-menu">
    <Menu.Button>Filter by Course</Menu.Button>
    <Menu.Items>
      {courses.map((course) => (
        <Menu.Item key={course.id}>
          {({ active }) => (
            <button className={active ? 'active' : ''}>
              {course.name}
            </button>
          )}
        </Menu.Item>
      ))}
    </Menu.Items>
  </Menu>
</div>
```

## Immediate Implementation Guide

### Step 1: Project Setup
```bash
# Create React app with Vite
npm create vite@latest spice-app -- --template react-ts
cd spice-app

# Install Firebase dependencies
npm install firebase react-router-dom

# Install UI dependencies
npm install lucide-react react-hot-toast
npm install @headlessui/react
npm install styled-components

# Install development tools
npm install -D @types/react @types/react-dom
npm install -D @types/styled-components
npm install -D eslint prettier
```

### Step 2: Styling Setup
1. Set up CSS Modules or Styled Components
2. Create design system with CSS custom properties
3. Implement responsive design patterns

### Step 3: Firebase Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (optional)
4. Get Firebase config object
5. Set up environment variables

### Step 4: Core File Structure
```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   └── types.ts             # TypeScript interfaces
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── VideoCard.tsx        # Video display component
│   ├── RatingComponent.tsx  # Spice rating system
│   └── VideoList.tsx        # Video grid/list
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── Videos.tsx           # Video browsing page
│   └── VideoDetail.tsx      # Individual video page
├── hooks/
│   ├── useVideos.ts         # Video data management
│   ├── useRatings.ts        # Rating operations
│   └── useRecommendations.ts # Recommendation logic
└── services/
    ├── videoService.ts      # Video CRUD operations
    ├── ratingService.ts     # Rating CRUD operations
    └── panoptoService.ts    # Panopto API integration
```

### Step 5: Essential TypeScript Interfaces
```typescript
// lib/types.ts
export interface Video {
  id: string;
  panoptoId: string;
  title: string;
  description: string;
  duration: number;
  courseId: string;
  courseName: string;
  lecturer: string;
  uploadDate: Date;
  thumbnailUrl: string;
  videoUrl: string;
  avgRatings: {
    difficulty: number;
    importance: number;
    clarity: number;
    overall: number;
  };
  totalRatings: number;
}

export interface Rating {
  id: string;
  userId: string;
  videoId: string;
  difficultyRating: number;
  importanceRating: number;
  clarityRating: number;
  overallRating: number;
  comment?: string;
  createdAt: Date;
  isAnonymous: boolean;
}
```

### Step 6: MVP Features Priority
1. **Basic video listing** (mock data)
2. **Rating component functionality**
3. **Firebase integration**
4. **Panopto API integration**
5. **Recommendations algorithm**

## Development Phases

### Phase 1: MVP Development (4 weeks)
**Setup & Architecture**
- Project initialization and repository setup
- Development environment configuration
- Database design and setup
- Basic React app structure

**Firebase Setup & Panopto Integration**
- Firebase project setup and configuration
- Panopto API integration and testing
- Anonymous user support implementation
- Basic video fetching and storage in Firestore

**Week 5-6: Core Rating System**
- Rating component development
- Database operations for ratings
- Basic video listing and search
- User dashboard implementation

**Week 7-8: Recommendation Engine**
- Basic recommendation algorithm
- Recommendation API development
- Frontend recommendation display
- Testing and bug fixes

**Week 9-10: Polish & Deploy**
- UI/UX improvements
- Performance optimization
- Security testing
- Production deployment

### Phase 2: Advanced Features (6-8 weeks)
**Analytics Foundation**
- Viewing tracking implementation
- Heatmap data collection
- Analytics database schema

**Heatmap Visualization**
- Frontend heatmap components
- Real-time data processing
- Interactive timeline features

**Week 5-6: Social Features**
- Community rating displays
- User interaction features
- Advanced recommendation algorithms

**Week 7-8: Lecturer Dashboard**
- Analytics dashboard for lecturers
- Performance metrics
- Content insights and reporting

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase SDK** - Database and authentication
- **React Router** - Client-side routing
- **Headless UI** - Unstyled, accessible UI components
- **CSS Modules / Styled Components** - Component-scoped styling
- **Lucide React** - Icon library
- **Chart.js** - Data visualization
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Firebase Admin SDK** - Database and authentication
- **Firestore** - NoSQL database
- **Firebase Functions** - Serverless backend (alternative)
- **Firebase Hosting** - Static site hosting

### DevOps & Infrastructure
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **AWS/Azure** - Cloud hosting
- **Nginx** - Reverse proxy
- **PM2** - Process management

### Testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **Supertest** - API testing

## Security Considerations

### Authentication & Authorization
- Firebase Authentication (optional for users)
- Anonymous user support with session persistence
- Firebase Security Rules for data access
- API rate limiting and abuse prevention

### Data Privacy
- GDPR compliance for user data
- Secure storage of rating and viewing data
- Data anonymization for analytics
- User consent management

### API Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## Deployment Architecture

### Production Environment
```
Firebase Hosting (React App)
    ↓
Firebase Functions (API) / Express.js Server
    ↓
Firestore Database
    ↓
Firebase Authentication (Optional)
    ↓
Firebase Analytics & Performance
```

### Environment Configuration

#### Required Environment Variables (.env)
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Panopto API Configuration
VITE_PANOPTO_BASE_URL=https://imperial.cloud.panopto.eu
PANOPTO_CLIENT_ID=your_client_id
PANOPTO_CLIENT_SECRET=your_client_secret

# Application Configuration
VITE_APP_NAME=Spice
VITE_APP_VERSION=1.0.0
```

#### Firebase Configuration File (firebase.json)
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"],
    "source": "functions"
  }
}
```

#### Deployment Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm install -g firebase-tools
firebase login
firebase deploy
```

## Success Metrics

### User Engagement
- Daily/Monthly Active Users (DAU/MAU)
- Average session duration
- Rating submission rate
- Video completion rates

### Content Quality
- Average spice ratings across videos
- User satisfaction scores
- Recommendation click-through rates
- Content discovery metrics

### Platform Performance
- API response times
- Page load speeds
- Error rates and uptime
- User retention rates

## Future Enhancements

### Advanced Analytics
- Machine learning for personalized recommendations
- Natural language processing of video transcripts
- Predictive analytics for exam preparation
- Cross-institutional data sharing

### Mobile Application
- React Native mobile app
- Offline viewing capabilities
- Push notifications for recommendations
- Mobile-optimized rating interface

### Integration Expansion
- Blackboard/Moodle integration
- Calendar integration for deadline awareness
- Microsoft Teams integration
- Zoom recording integration

## Risk Assessment

### Technical Risks
- **Panopto API Changes**: Monitor API versioning and updates
- **Firebase Costs**: Monitor usage and implement cost controls
- **Anonymous Data Quality**: Handle potential spam ratings
- **Data Loss**: Firebase automatic backups and export strategies

### Business Risks
- **User Adoption**: Comprehensive onboarding and training
- **Privacy Concerns**: Transparent data usage policies
- **Content Moderation**: Community guidelines and reporting
- **Institutional Support**: Stakeholder engagement plan

## Immediate Next Steps

### Pre-Development Checklist
- [ ] Set up Firebase project and get configuration keys
- [ ] Research Panopto API documentation and get access credentials
- [ ] Create GitHub repository with proper .gitignore
- [ ] Set up development environment (Node.js, npm, VS Code)
- [ ] Install Firebase CLI and authenticate

### Development Priority Order
1. **Initialize React app with TypeScript and CSS Modules**
2. **Set up design system with CSS custom properties**
3. **Create basic video card components with mock data**
4. **Implement spice rating system (1-5 chili peppers)**
5. **Set up Firebase Firestore collections**
6. **Add video listing and search functionality**
7. **Integrate basic recommendation algorithm**
8. **Connect to Panopto API for real video data**
9. **Deploy MVP to Firebase Hosting**

### Critical Dependencies
- **Panopto API Access**: Contact Imperial IT for API credentials
- **Firebase Project**: Create and configure Firebase project
- **Domain Setup**: Decide on domain name and hosting approach
- **Testing Data**: Prepare sample video data for development

### Success Criteria for MVP
- ✅ Users can browse videos without authentication
- ✅ Users can rate videos with 4 different spice categories
- ✅ Basic recommendations based on average ratings
- ✅ Search and filter functionality
- ✅ Responsive design for mobile and desktop
- ✅ Firebase deployment with real-time data sync

### Timeline Commitment
- **Phase 1**: Project setup and basic components
- **Phase 2**: Firebase integration and rating system
- **Phase 3**: Panopto integration and real data
- **Phase 4**: Recommendations and deployment

## Conclusion

This specification is now implementation-ready with clear technical requirements, file structure, and step-by-step setup instructions. The modular approach allows for rapid development while maintaining code quality and scalability.

**Ready to start development immediately!** 🌶️🚀