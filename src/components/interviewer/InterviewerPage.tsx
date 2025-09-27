import React, { useState } from 'react';
import { LogOut, Search, Filter, Download } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useStore } from '../../store/useStore';
import { Candidate } from '../../types';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import './InterviewerPage.css';

const InterviewerPage: React.FC = () => {
  const { logout } = useAuth();
  const { candidates } = useStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');

  const handleSignOut = () => {
    logout();
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(candidate => {
      // Status filter
      if (filterBy !== 'all') {
        return candidate.status === filterBy;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.totalScore - a.totalScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        default:
          return 0;
      }
    });

  const getStatusStats = () => {
    const stats = {
      total: candidates.length,
      completed: candidates.filter(c => c.status === 'completed').length,
      in_progress: candidates.filter(c => c.status === 'in_progress').length,
      pending: candidates.filter(c => c.status === 'pending').length
    };
    return stats;
  };

  const stats = getStatusStats();

  const handleExportData = () => {
    const csvData = candidates.map(candidate => ({
      Name: candidate.name,
      Email: candidate.email,
      Phone: candidate.phone,
      Score: candidate.totalScore,
      Status: candidate.status,
      'Start Time': new Date(candidate.startTime).toLocaleString(),
      'End Time': candidate.endTime ? new Date(candidate.endTime).toLocaleString() : 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-candidates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedCandidate) {
    return (
      <CandidateDetail 
        candidate={selectedCandidate} 
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="interviewer-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Interview Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleExportData} className="btn btn-outline">
              <Download size={16} />
              Export Data
            </button>
            <button onClick={handleSignOut} className="btn btn-outline">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Candidates</h3>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <span className="stat-number">{stats.completed}</span>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <span className="stat-number">{stats.in_progress}</span>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <span className="stat-number">{stats.pending}</span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <Filter size={16} />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="score">Sort by Score</option>
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <CandidateList 
            candidates={filteredCandidates}
            onCandidateSelect={setSelectedCandidate}
          />
        </div>
      </main>
    </div>
  );
};

export default InterviewerPage;
