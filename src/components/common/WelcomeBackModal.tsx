import React from 'react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './WelcomeBackModal.css';

const WelcomeBackModal: React.FC = () => {
  const { 
    showWelcomeBackModal, 
    setShowWelcomeBackModal, 
    currentSession, 
    setCurrentSession 
  } = useStore();

  const handleResume = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'in_progress'
      });
    }
    setShowWelcomeBackModal(false);
  };

  const handleStartOver = () => {
    setCurrentSession(null);
    setShowWelcomeBackModal(false);
  };

  if (!showWelcomeBackModal || !currentSession) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content welcome-back-modal">
        <div className="modal-header">
          <h2>Welcome Back!</h2>
        </div>
        
        <div className="welcome-content">
          <Clock size={48} className="welcome-icon" />
          <p>You have an interview session in progress.</p>
          <p className="session-info">
            Started: {new Date(currentSession.startTime).toLocaleString()}
          </p>
          <p className="session-info">
            Progress: {currentSession.currentQuestionIndex} of {currentSession.questions.length} questions
          </p>
        </div>

        <div className="welcome-actions">
          <button 
            className="btn btn-primary"
            onClick={handleResume}
          >
            <Play size={20} />
            Resume Interview
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={handleStartOver}
          >
            <RotateCcw size={20} />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;
