# AI Interview Assistant

A comprehensive React-based interview management system with AI-powered question generation and candidate evaluation.

## Features

### 🔐 Authentication & Role Management
- Google OAuth integration
- Role-based access (Interviewer/Interviewee)
- Secure session management

### 👤 Interviewee Experience
- Resume upload and parsing (PDF support)
- Automatic extraction of Name, Email, Phone
- Interactive chat-based interview interface
- Real-time timers for each question
- Progressive difficulty (Easy → Medium → Hard)
- AI-generated feedback and scoring

### 📊 Interviewer Dashboard
- Candidate management and tracking
- Real-time interview monitoring
- Detailed candidate profiles and responses
- Search and filter functionality
- Export capabilities
- Performance analytics

### 💾 Data Persistence
- Local storage for session continuity
- Resume progress across browser sessions
- Welcome back modal for interrupted interviews

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Zustand with persistence
- **Routing**: React Router v7
- **Authentication**: Firebase Auth
- **File Processing**: PDF-parse for resume extraction
- **UI Components**: Custom CSS with Lucide React icons
- **Data Storage**: Local storage with Zustand middleware

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### 2. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and select Google as a sign-in provider
3. Copy your Firebase configuration
4. Update `src/firebase.ts` with your configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Installation
```bash
# Navigate to project directory
cd ai-interview-assistant

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx          # Authentication and role selection
│   │   └── LoginPage.css
│   ├── common/
│   │   ├── WelcomeBackModal.tsx   # Session restoration modal
│   │   └── WelcomeBackModal.css
│   ├── interviewee/
│   │   ├── IntervieweePage.tsx    # Main interviewee interface
│   │   ├── IntervieweePage.css
│   │   ├── ResumeUpload.tsx       # File upload component
│   │   ├── ResumeUpload.css
│   │   ├── InterviewChat.tsx      # Interview chat interface
│   │   └── InterviewChat.css
│   └── interviewer/
│       ├── InterviewerPage.tsx    # Dashboard main page
│       ├── InterviewerPage.css
│       ├── CandidateList.tsx      # Candidate listing
│       ├── CandidateList.css
│       ├── CandidateDetail.tsx    # Individual candidate view
│       └── CandidateDetail.css
├── store/
│   └── useStore.ts               # Zustand state management
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   └── resumeParser.ts           # Resume parsing utilities
├── firebase.ts                   # Firebase configuration
└── App.tsx                       # Main application component
```

## Interview Flow

### For Interviewees:
1. **Authentication**: Sign in with Google and select "Interviewee" role
2. **Resume Upload**: Upload PDF resume for automatic data extraction
3. **Data Validation**: Fill in any missing information (name, email, phone)
4. **Interview**: Answer 6 progressively difficult questions with timers
5. **Results**: Receive AI-generated feedback and final score

### For Interviewers:
1. **Authentication**: Sign in with Google and select "Interviewer" role
2. **Dashboard**: View all candidates with filtering and search
3. **Monitoring**: Track interview progress in real-time
4. **Analysis**: Review detailed candidate responses and scores
5. **Export**: Download candidate data for external analysis

## Question Structure

- **Easy Questions (2)**: 20 seconds each
  - Basic React and JavaScript concepts
- **Medium Questions (2)**: 60 seconds each
  - Advanced React hooks and database concepts
- **Hard Questions (2)**: 120 seconds each
  - System design and complex JavaScript problems

## Data Persistence

All interview data is stored locally using Zustand's persistence middleware:
- Interview progress is saved automatically
- Candidates can resume interrupted sessions
- Interviewers can view historical data
- Data persists across browser sessions

## Customization

### Adding New Question Categories
Update the `mockQuestions` array in `IntervieweePage.tsx`:

```typescript
const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Your question text',
    difficulty: 'easy', // 'easy' | 'medium' | 'hard'
    timeLimit: 20,
    category: 'Your Category'
  },
  // ... more questions
];
```

### Modifying Scoring Algorithm
Update the scoring logic in `InterviewChat.tsx`:

```typescript
const answer: Answer = {
  questionId: session.questions[session.currentQuestionIndex].id,
  answer: answerText || currentAnswer,
  score: calculateScore(answerText || currentAnswer), // Your scoring function
  feedback: generateFeedback(answerText || currentAnswer),
  timeSpent: session.questions[session.currentQuestionIndex].timeLimit - timeLeft
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## Roadmap

- [ ] DOCX resume parsing support
- [ ] Real AI integration for question generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video interview capabilities
- [ ] Integration with HR systems