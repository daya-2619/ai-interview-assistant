import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { useStore } from './store/useStore';
import LoginPage from './components/auth/LoginPage';
import IntervieweePage from './components/interviewee/IntervieweePage';
import InterviewerPage from './components/interviewer/InterviewerPage';
import WelcomeBackModal from './components/common/WelcomeBackModal';
import './App.css';

function AppContent() {
  const { showWelcomeBackModal, setShowWelcomeBackModal, currentSession } = useStore();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check if there's an interrupted session only on app load
    if (currentSession && currentSession.status === 'in_progress') {
      setShowWelcomeBackModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/interviewee" 
            element={
              user.role === 'interviewee' ? 
                <IntervieweePage /> : 
                <Navigate to="/interviewer" replace />
            } 
          />
          <Route 
            path="/interviewer" 
            element={
              user.role === 'interviewer' ? 
                <InterviewerPage /> : 
                <Navigate to="/interviewee" replace />
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={user.role === 'interviewee' ? '/interviewee' : '/interviewer'} replace />
            } 
          />
        </Routes>
        
        {showWelcomeBackModal && <WelcomeBackModal />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;