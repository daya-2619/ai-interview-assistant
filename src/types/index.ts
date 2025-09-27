export interface User {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'interviewer' | 'interviewee';
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  file?: File;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  category: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  score: number;
  feedback: string;
  timeSpent: number;
  strengths?: string[];
  improvements?: string[];
  evaluatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeData: ResumeData;
  answers: Answer[];
  currentQuestionIndex: number;
  totalScore: number;
  summary: string;
  status: 'pending' | 'in_progress' | 'completed';
  startTime: Date;
  endTime?: Date;
}

export interface InterviewSession {
  candidateId: string;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  status: 'pending' | 'in_progress' | 'completed';
  startTime: Date;
  endTime?: Date;
}
