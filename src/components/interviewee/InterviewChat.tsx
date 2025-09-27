import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Send, CheckCircle, RotateCcw, Home } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Answer, Question } from '../../types';
import { aiService } from '../../services/aiService';
import './InterviewChat.css';

const InterviewChat: React.FC = () => {
  const { 
    currentSession, 
    updateSession, 
    updateCandidate,
    getCandidate,
    setCurrentSession,
    setShowWelcomeBackModal
  } = useStore();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const session = currentSession;
  const candidate = session ? getCandidate(session.candidateId) : null;


  const submitAnswer = useCallback(async (answerText?: string) => {
    if (!session || !candidate) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const answerToSubmit = answerText || currentAnswer;
    
    // Use AI to evaluate the answer
    const evaluation = await aiService.evaluateAnswer(
      currentQuestion, 
      answerToSubmit, 
      candidate
    );

    const answer: Answer = {
      questionId: currentQuestion.id,
      answer: answerToSubmit,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      timeSpent: currentQuestion.timeLimit - timeLeft,
      evaluatedAt: new Date()
    };

    const newAnswers = [...session.answers, answer];
    const nextQuestionIndex = session.currentQuestionIndex + 1;

    if (nextQuestionIndex >= session.questions.length) {
      // Interview completed - generate AI summary
      const totalScore = newAnswers.reduce((sum, ans) => sum + ans.score, 0) / newAnswers.length;
      const aiSummary = await aiService.generateCandidateSummary(candidate, newAnswers);

      updateCandidate(candidate.id, {
        answers: newAnswers,
        totalScore,
        summary: aiSummary,
        status: 'completed',
        endTime: new Date()
      });

      updateSession({
        answers: newAnswers,
        currentQuestionIndex: nextQuestionIndex,
        status: 'completed',
        endTime: new Date()
      });

      setShowResults(true);
    } else {
      // Move to next question
      updateSession({
        answers: newAnswers,
        currentQuestionIndex: nextQuestionIndex
      });

      setCurrentAnswer('');
      const nextQuestion = session.questions[nextQuestionIndex];
      setTimeLeft(nextQuestion.timeLimit);
      setIsTimerRunning(true);
    }
  }, [session, candidate, currentAnswer, timeLeft, updateCandidate, updateSession, setShowResults]);

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    if (currentAnswer.trim()) {
      submitAnswer();
    } else {
      submitAnswer('No answer provided (time ran out)');
    }
  }, [currentAnswer, submitAnswer]);

  useEffect(() => {
    if (session && session.status === 'in_progress') {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      if (currentQuestion) {
        setTimeLeft(currentQuestion.timeLimit);
        setIsTimerRunning(true);
      }
    }
  }, [session]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerRunning, timeLeft, handleTimeUp]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.currentQuestionIndex]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };




  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleRestart = () => {
    setCurrentSession(null);
    setShowResults(false);
    setShowWelcomeBackModal(false);
  };

  const handleGoHome = () => {
    handleRestart();
  };

  if (!session || !candidate) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    return (
      <div className="interview-complete">
        <div className="results-card">
          <CheckCircle size={64} className="success-icon" />
          <h1>Interview Complete!</h1>
          <p>Thank you for completing the interview, {candidate.name}.</p>
          
          <div className="score-display">
            <h2>Your Score</h2>
            <div className="score-circle">
              <span className="score-number">{candidate.totalScore.toFixed(1)}</span>
              <span className="score-label">/ 100</span>
            </div>
          </div>

          <div className="summary">
            <h3>Summary</h3>
            <p>{candidate.summary}</p>
          </div>

          <div className="actions">
            <button onClick={handleRestart} className="btn btn-primary">
              <RotateCcw size={20} />
              Take Another Interview
            </button>
            <button onClick={handleGoHome} className="btn btn-outline">
              <Home size={20} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];

  return (
    <div className="interview-chat">
      <div className="chat-header">
        <div className="progress-info">
          <h2>Interview in Progress</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((session.currentQuestionIndex + 1) / session.questions.length) * 100}%` 
              }}
            />
          </div>
          <p>Question {session.currentQuestionIndex + 1} of {session.questions.length}</p>
        </div>
        
        <div className="timer-display">
          <Clock size={24} />
          <span className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        <div className="message bot-message">
          <div className="message-content">
            <div className="question-header">
              <span 
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty) }}
              >
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="category">{currentQuestion.category}</span>
            </div>
            <p>{currentQuestion.text}</p>
          </div>
        </div>

        {session.answers.map((answer, index) => {
          return (
            <div key={answer.questionId} className="message user-message">
              <div className="message-content">
                <div className="answer-header">
                  <span>Your Answer:</span>
                  <span className="score">Score: {answer.score}/100</span>
                </div>
                <p>{answer.answer}</p>
                <div className="feedback">
                  <strong>Feedback:</strong> {answer.feedback}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
            disabled={!isTimerRunning}
          />
          <button
            onClick={() => submitAnswer()}
            disabled={!currentAnswer.trim() || !isTimerRunning}
            className="btn btn-primary send-btn"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="input-hint">
          {isTimerRunning ? 
            `You have ${formatTime(timeLeft)} remaining` : 
            'Time\'s up! Answer will be submitted automatically.'
          }
        </p>
      </div>
    </div>
  );
};

export default InterviewChat;
