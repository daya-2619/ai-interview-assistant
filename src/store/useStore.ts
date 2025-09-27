import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Candidate, InterviewSession, ResumeData } from '../types';

interface AppState {
  
  // Candidates data
  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  getCandidate: (id: string) => Candidate | undefined;
  
  // Current interview session
  currentSession: InterviewSession | null;
  setCurrentSession: (session: InterviewSession | null) => void;
  updateSession: (updates: Partial<InterviewSession>) => void;
  
  // Resume data for current user
  currentResumeData: ResumeData | null;
  setCurrentResumeData: (data: ResumeData | null) => void;
  
  // Welcome back modal
  showWelcomeBackModal: boolean;
  setShowWelcomeBackModal: (show: boolean) => void;
  
  // Clear all data
  clearAllData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      
      // Candidates data
      candidates: [],
      addCandidate: (candidate) => set((state) => ({
        candidates: [...state.candidates, candidate]
      })),
      updateCandidate: (id, updates) => set((state) => ({
        candidates: state.candidates.map(candidate =>
          candidate.id === id ? { ...candidate, ...updates } : candidate
        )
      })),
      getCandidate: (id) => {
        const state = get();
        return state.candidates.find(candidate => candidate.id === id);
      },
      
      // Current interview session
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),
      updateSession: (updates) => set((state) => ({
        currentSession: state.currentSession ? { ...state.currentSession, ...updates } : null
      })),
      
      // Resume data
      currentResumeData: null,
      setCurrentResumeData: (data) => set({ currentResumeData: data }),
      
      // Welcome back modal
      showWelcomeBackModal: false,
      setShowWelcomeBackModal: (show) => set({ showWelcomeBackModal: show }),
      
      // Clear all data
      clearAllData: () => set({
        candidates: [],
        currentSession: null,
        currentResumeData: null,
        showWelcomeBackModal: false
      }),
    }),
    {
      name: 'ai-interview-storage',
      partialize: (state) => ({
        candidates: state.candidates,
        currentSession: state.currentSession,
        currentResumeData: state.currentResumeData,
        showWelcomeBackModal: state.showWelcomeBackModal
      }),
    }
  )
);
