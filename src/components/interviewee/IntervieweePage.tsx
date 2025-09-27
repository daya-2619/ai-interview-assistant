import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useStore } from '../../store/useStore';
import { ResumeData, Candidate, Question } from '../../types';
import { parseResumeData } from '../../utils/resumeParser';
import { aiService } from '../../services/aiService';
import ResumeUpload from './ResumeUpload';
import InterviewChat from './InterviewChat';
import './IntervieweePage.css';

const IntervieweePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    currentResumeData, 
    setCurrentResumeData,
    currentSession,
    setCurrentSession,
    addCandidate,
    setShowWelcomeBackModal
  } = useStore();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);

  // State for AI-generated questions
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Check if we have an existing session
    if (currentSession && currentSession.status === 'in_progress') {
      setShowChat(true);
    }
  }, [currentSession]);

  const handleResumeUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');

    try {
      const parsedData = await parseResumeData(file);
      const resumeData: ResumeData = {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        file
      };

      console.log('Parsed resume data:', resumeData);

      // Check for missing fields
      const missing: string[] = [];
      if (!resumeData.name) missing.push('Name');
      if (!resumeData.email) missing.push('Email');
      if (!resumeData.phone) missing.push('Phone');

      console.log('Missing fields check:', { name: resumeData.name, email: resumeData.email, phone: resumeData.phone });
      console.log('Missing fields array:', missing);

      setMissingFields(missing);
      setCurrentResumeData(resumeData);

      if (missing.length === 0) {
        // All fields are present, mark as ready for interview
        console.log('All fields present, setting resumeReady to true');
        setResumeReady(true);
      } else {
        console.log('Missing fields:', missing);
        setResumeReady(false);
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      setUploadError('Failed to parse resume. Please make sure it\'s a valid PDF or DOCX file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMissingFieldSubmit = (field: string, value: string) => {
    if (!currentResumeData) return;

    const updatedData = { ...currentResumeData };
    switch (field) {
      case 'name':
        updatedData.name = value;
        break;
      case 'email':
        updatedData.email = value;
        break;
      case 'phone':
        updatedData.phone = value;
        break;
    }

    setCurrentResumeData(updatedData);
    
    // Remove from missing fields
    const newMissing = missingFields.filter(f => f !== field);
    setMissingFields(newMissing);

    // If no more missing fields, mark as ready for interview
    if (newMissing.length === 0) {
      console.log('No more missing fields, setting resumeReady to true');
      setResumeReady(true);
    }
  };

  const handleStartInterview = async (resumeData: ResumeData) => {
    setIsGeneratingQuestions(true);
    
    try {
      // Generate AI questions based on candidate's resume
      const questions = await aiService.generateQuestions(resumeData.name, resumeData);
      setGeneratedQuestions(questions);

      // Create candidate
      const candidate: Candidate = {
        id: Date.now().toString(),
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        resumeData,
        answers: [],
        currentQuestionIndex: 0,
        totalScore: 0,
        summary: '',
        status: 'in_progress',
        startTime: new Date()
      };

      // Create session with AI-generated questions
      const session = {
        candidateId: candidate.id,
        questions: questions,
        answers: [],
        currentQuestionIndex: 0,
        status: 'in_progress' as const,
        startTime: new Date()
      };

      addCandidate(candidate);
      setCurrentSession(session);
      setShowChat(true);

      // Clear any welcome back modal state
      setShowWelcomeBackModal(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setUploadError('Failed to generate interview questions. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  const [inputValue, setInputValue] = useState('');

  const renderMissingFieldForm = () => {
    if (missingFields.length === 0) return null;

    const field = missingFields[0];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        handleMissingFieldSubmit(field, inputValue.trim());
        setInputValue(''); // Reset input after submission
      }
    };

    return (
      <div className="missing-field-form">
        <h3>Missing Information</h3>
        <p>We couldn't find your {field.toLowerCase()} in the resume. Please provide it to continue:</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type={field === 'Email' ? 'email' : field === 'Phone' ? 'tel' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter your ${field.toLowerCase()}`}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    );
  };

  if (showChat && currentSession) {
    return <InterviewChat />;
  }

  return (
    <div className="interviewee-page">
      <header className="page-header">
        <div className="header-content">
          <h1>AI Interview Assistant</h1>
          <div className="user-info">
            <span>Welcome, {user?.name || 'User'}</span>
            <button onClick={handleSignOut} className="btn btn-outline">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          <div className="upload-section">
            <h2>Upload Your Resume PDF</h2>
            <p>Upload your resume PDF file to start the interview process. Our system will automatically extract your name, email, and mobile number from your PDF document.</p>
            
            <ResumeUpload 
              onUpload={handleResumeUpload}
              isUploading={isUploading}
              error={uploadError}
            />

            {currentResumeData && (
              <div className="resume-preview">
                <h3>Information Extracted from Your Resume PDF</h3>
                <p className="extraction-note">
                  The following details have been automatically extracted from the PDF resume you uploaded:
                </p>
                <div className="info-grid">
                  <div className="info-item">
                    <User size={20} />
                    <div className="info-content">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{currentResumeData.name || 'Not found in PDF'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Mail size={20} />
                    <div className="info-content">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{currentResumeData.email || 'Not found in PDF'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone size={20} />
                    <div className="info-content">
                      <span className="info-label">Mobile:</span>
                      <span className="info-value">{currentResumeData.phone || 'Not found in PDF'}</span>
                    </div>
                  </div>
                </div>
                <div className="extraction-status">
                  <div className="status-indicator">
                    <div className="status-icon">✓</div>
                    <span>PDF Processing Complete</span>
                  </div>
                </div>
              </div>
            )}

            {renderMissingFieldForm()}

                {resumeReady && currentResumeData && (
                  <div className="start-interview-section">
                    <div className="start-interview-card">
                      <h3>Ready to Start Your AI Interview!</h3>
                      <p>Your resume has been successfully processed. Click the button below to begin your personalized AI-powered interview with unique questions generated just for you.</p>
                      <button
                        className="btn btn-primary start-interview-btn"
                        onClick={() => handleStartInterview(currentResumeData)}
                        disabled={isGeneratingQuestions}
                      >
                        {isGeneratingQuestions ? (
                          <>
                            <div className="spinner-small"></div>
                            Generating Questions...
                          </>
                        ) : (
                          'Start AI Interview'
                        )}
                      </button>
                    </div>
                  </div>
                )}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                <strong>Debug Info:</strong><br/>
                Resume Ready: {resumeReady ? 'Yes' : 'No'}<br/>
                Current Resume Data: {currentResumeData ? 'Present' : 'None'}<br/>
                Missing Fields: {missingFields.length > 0 ? missingFields.join(', ') : 'None'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntervieweePage;
