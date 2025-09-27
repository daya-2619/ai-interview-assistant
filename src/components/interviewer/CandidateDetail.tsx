import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Clock, FileText } from 'lucide-react';
import { Candidate } from '../../types';
import './CandidateDetail.css';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onBack }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000 / 60);
    return `${duration} minutes`;
  };

  return (
    <div className="candidate-detail">
      <div className="detail-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <div className="candidate-title">
          <h1>{candidate.name}</h1>
          <div className="title-meta">
            <span className="status-badge">{candidate.status.toUpperCase()}</span>
            <span 
              className="score-badge"
              style={{ backgroundColor: getScoreColor(candidate.totalScore) }}
            >
              {candidate.totalScore.toFixed(1)}/100
            </span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-grid">
          {/* Candidate Information */}
          <div className="detail-card">
            <h2>Candidate Information</h2>
            <div className="info-list">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{candidate.email}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Phone size={20} />
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{candidate.phone}</span>
                </div>
              </div>
              
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Interview Started</span>
                  <span className="info-value">{formatDate(candidate.startTime)}</span>
                </div>
              </div>
              
              {candidate.endTime && (
                <div className="info-item">
                  <Clock size={20} />
                  <div>
                    <span className="info-label">Interview Completed</span>
                    <span className="info-value">{formatDate(candidate.endTime)}</span>
                  </div>
                </div>
              )}
              
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <span className="info-label">Total Duration</span>
                  <span className="info-value">{formatDuration(candidate.startTime, candidate.endTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Performance */}
          <div className="detail-card">
            <h2>Overall Performance</h2>
            <div className="performance-summary">
              <div className="score-circle">
                <span className="score-number">{candidate.totalScore.toFixed(1)}</span>
                <span className="score-label">/ 100</span>
              </div>
              <div className="performance-stats">
                <div className="stat-row">
                  <span>Questions Answered</span>
                  <span>{candidate.answers.length}/6</span>
                </div>
                <div className="stat-row">
                  <span>Average Time per Question</span>
                  <span>{candidate.answers.length > 0 ? 
                    Math.round(candidate.answers.reduce((sum, ans) => sum + ans.timeSpent, 0) / candidate.answers.length) : 0}s
                  </span>
                </div>
                <div className="stat-row">
                  <span>Completion Rate</span>
                  <span>{candidate.answers.length > 0 ? 
                    Math.round((candidate.answers.length / 6) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {candidate.summary && (
            <div className="detail-card summary-card">
              <h2>AI Assessment Summary</h2>
              <div className="summary-content">
                <FileText size={24} />
                <p>{candidate.summary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Question & Answer Details */}
        {candidate.answers.length > 0 && (
          <div className="answers-section">
            <h2>Interview Responses</h2>
            <div className="answers-list">
              {candidate.answers.map((answer, index) => {
                // This is a simplified version - in a real app, you'd have access to the actual questions
                const mockQuestion = {
                  text: `Question ${index + 1}`,
                  difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard',
                  category: index < 2 ? 'React' : index < 4 ? 'JavaScript' : 'System Design'
                };
                
                return (
                  <div key={answer.questionId} className="answer-item">
                    <div className="question-header">
                      <div className="question-info">
                        <h3>Question {index + 1}</h3>
                        <div className="question-meta">
                          <span 
                            className="difficulty-badge"
                            style={{ backgroundColor: getDifficultyColor(mockQuestion.difficulty) }}
                          >
                            {mockQuestion.difficulty.toUpperCase()}
                          </span>
                          <span className="category">{mockQuestion.category}</span>
                        </div>
                      </div>
                      <div className="answer-score">
                        <span 
                          className="score"
                          style={{ color: getScoreColor(answer.score) }}
                        >
                          {answer.score}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="question-content">
                      <p>{mockQuestion.text}</p>
                    </div>
                    
                    <div className="answer-content">
                      <h4>Candidate's Answer:</h4>
                      <p>{answer.answer}</p>
                    </div>
                    
                    <div className="feedback-content">
                      <h4>AI Feedback:</h4>
                      <p>{answer.feedback}</p>
                      
                      {answer.strengths && answer.strengths.length > 0 && (
                        <div className="answer-strengths">
                          <h5>Strengths:</h5>
                          <ul>
                            {answer.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {answer.improvements && answer.improvements.length > 0 && (
                        <div className="answer-improvements">
                          <h5>Areas for Improvement:</h5>
                          <ul>
                            {answer.improvements.map((improvement, idx) => (
                              <li key={idx}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="answer-meta">
                      <span>Time spent: {answer.timeSpent}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
