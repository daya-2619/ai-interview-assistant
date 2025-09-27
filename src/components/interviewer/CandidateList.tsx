import React from 'react';
import { Eye, Mail, Phone, Calendar, Award, Clock } from 'lucide-react';
import { Candidate } from '../../types';
import './CandidateList.css';

interface CandidateListProps {
  candidates: Candidate[];
  onCandidateSelect: (candidate: Candidate) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates, onCandidateSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <Award size={64} />
          <h3>No Candidates Found</h3>
          <p>No candidates match your current filters. Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-list">
      <div className="list-header">
        <h2>Candidates ({candidates.length})</h2>
      </div>

      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <div 
            key={candidate.id} 
            className="candidate-card"
            onClick={() => onCandidateSelect(candidate)}
          >
            <div className="candidate-header">
              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={14} />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={14} />
                    <span>{candidate.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="candidate-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(candidate.status) }}
                >
                  {candidate.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="candidate-stats">
              <div className="stat-item">
                <Award size={16} />
                <span className="stat-label">Score</span>
                <span 
                  className="stat-value"
                  style={{ color: getScoreColor(candidate.totalScore) }}
                >
                  {candidate.totalScore.toFixed(1)}/100
                </span>
              </div>
              
              <div className="stat-item">
                <Calendar size={16} />
                <span className="stat-label">Started</span>
                <span className="stat-value">
                  {formatDate(candidate.startTime)}
                </span>
              </div>

              {candidate.status === 'completed' && (
                <div className="stat-item">
                  <Clock size={16} />
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">
                    {candidate.endTime ? formatDate(candidate.endTime) : 'N/A'}
                  </span>
                </div>
              )}
            </div>

            {candidate.status === 'completed' && candidate.summary && (
              <div className="candidate-summary">
                <p>{candidate.summary.substring(0, 120)}...</p>
              </div>
            )}

            <div className="card-footer">
              <button className="view-details-btn">
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
