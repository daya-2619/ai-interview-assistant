import { Question, Answer } from '../types';

// Mock AI API service - In production, this would connect to OpenAI, Claude, or similar
export class AIService {
  private static instance: AIService;
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Generate unique questions for a candidate based on their resume
  async generateQuestions(candidateName: string, resumeData: any): Promise<Question[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In production, this would be an actual API call to OpenAI/Claude
    // For now, we'll generate dynamic questions based on the candidate's info
    const questions: Question[] = [
      // Easy Questions (20 seconds each)
      {
        id: `easy_1_${Date.now()}`,
        text: `Hello ${candidateName}! Let's start with something basic. Can you explain what React is and why it's popular in web development?`,
        difficulty: 'easy',
        timeLimit: 20,
        category: 'React'
      },
      {
        id: `easy_2_${Date.now()}`,
        text: `Great! Now, can you tell me the difference between JavaScript and TypeScript? What are the benefits of using TypeScript?`,
        difficulty: 'easy',
        timeLimit: 20,
        category: 'JavaScript'
      },
      
      // Medium Questions (60 seconds each)
      {
        id: `medium_1_${Date.now()}`,
        text: `Moving to a more complex topic. How would you implement state management in a large React application? Discuss different approaches like Redux, Context API, or Zustand.`,
        difficulty: 'medium',
        timeLimit: 60,
        category: 'React'
      },
      {
        id: `medium_2_${Date.now()}`,
        text: `Let's talk about backend. How would you design a RESTful API for a user management system? What endpoints would you create and what data would they return?`,
        difficulty: 'medium',
        timeLimit: 60,
        category: 'Backend'
      },
      
      // Hard Questions (120 seconds each)
      {
        id: `hard_1_${Date.now()}`,
        text: `This is a system design question. How would you architect a real-time chat application that can handle 10,000 concurrent users? Consider scalability, real-time updates, and data persistence.`,
        difficulty: 'hard',
        timeLimit: 120,
        category: 'System Design'
      },
      {
        id: `hard_2_${Date.now()}`,
        text: `Final question: You need to optimize a React application that's experiencing performance issues. The app has 100+ components and is slow to render. Walk me through your debugging and optimization process.`,
        difficulty: 'hard',
        timeLimit: 120,
        category: 'Performance'
      }
    ];

    return questions;
  }

  // Evaluate an answer and provide score and feedback
  async evaluateAnswer(question: Question, answer: string, candidateInfo: any): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In production, this would be an actual AI evaluation
    // For now, we'll provide intelligent mock evaluations based on answer content
    const evaluation = this.generateIntelligentEvaluation(question, answer, candidateInfo);
    
    return evaluation;
  }

  private generateIntelligentEvaluation(question: Question, answer: string, candidateInfo: any): {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } {
    const answerLength = answer.length;
    const hasKeywords = this.checkKeywords(question, answer);
    const hasExamples = this.checkForExamples(answer);
    const hasTechnicalTerms = this.checkTechnicalTerms(question, answer);

    let baseScore = 40; // Base score for attempting

    // Length scoring (0-20 points)
    if (answerLength > 200) baseScore += 20;
    else if (answerLength > 100) baseScore += 15;
    else if (answerLength > 50) baseScore += 10;
    else if (answerLength > 20) baseScore += 5;

    // Keyword matching (0-20 points)
    if (hasKeywords) baseScore += 20;
    else if (hasKeywords > 0.5) baseScore += 15;
    else if (hasKeywords > 0.3) baseScore += 10;

    // Examples and technical depth (0-20 points)
    if (hasExamples && hasTechnicalTerms) baseScore += 20;
    else if (hasExamples || hasTechnicalTerms) baseScore += 10;

    // Ensure score is between 0-100
    const finalScore = Math.min(100, Math.max(0, baseScore));

    // Generate feedback based on score and content
    const feedback = this.generateFeedback(question, answer, finalScore, hasKeywords, hasExamples, hasTechnicalTerms);
    
    // Generate strengths and improvements
    const strengths = this.generateStrengths(finalScore, hasKeywords, hasExamples, hasTechnicalTerms);
    const improvements = this.generateImprovements(finalScore, hasKeywords, hasExamples, hasTechnicalTerms);

    return {
      score: finalScore,
      feedback,
      strengths,
      improvements
    };
  }

  private checkKeywords(question: Question, answer: string): number {
    const keywords = this.getKeywordsForQuestion(question);
    const answerLower = answer.toLowerCase();
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (answerLower.includes(keyword.toLowerCase())) {
        matches++;
      }
    });
    
    return matches / keywords.length;
  }

  private getKeywordsForQuestion(question: Question): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'React': ['react', 'component', 'jsx', 'state', 'props', 'hook', 'virtual dom', 'rendering'],
      'JavaScript': ['javascript', 'typescript', 'es6', 'async', 'promise', 'closure', 'prototype', 'hoisting'],
      'Backend': ['api', 'rest', 'endpoint', 'database', 'server', 'authentication', 'middleware', 'crud'],
      'System Design': ['scalability', 'load balancer', 'database', 'cache', 'microservices', 'websocket', 'real-time'],
      'Performance': ['optimization', 'bundle', 'lazy loading', 'memoization', 'profiling', 'rendering', 'performance']
    };

    return keywordMap[question.category] || [];
  }

  private checkForExamples(answer: string): boolean {
    const exampleIndicators = ['for example', 'like', 'such as', 'instance', 'example', 'case', 'scenario'];
    const answerLower = answer.toLowerCase();
    return exampleIndicators.some(indicator => answerLower.includes(indicator));
  }

  private checkTechnicalTerms(question: Question, answer: string): boolean {
    const technicalTerms = this.getKeywordsForQuestion(question);
    const answerLower = answer.toLowerCase();
    return technicalTerms.some(term => answerLower.includes(term.toLowerCase()));
  }

  private generateFeedback(question: Question, answer: string, score: number, hasKeywords: number, hasExamples: boolean, hasTechnicalTerms: boolean): string {
    if (score >= 90) {
      return `Excellent answer! You demonstrated deep understanding of ${question.category} concepts with clear explanations and relevant examples. Your technical knowledge is impressive.`;
    } else if (score >= 80) {
      return `Very good response! You showed solid understanding of ${question.category} with good technical details. Consider adding more specific examples to strengthen your answer.`;
    } else if (score >= 70) {
      return `Good answer with basic understanding of ${question.category}. You covered the main points but could benefit from more technical depth and practical examples.`;
    } else if (score >= 60) {
      return `Fair response showing some knowledge of ${question.category}. Try to be more specific with technical details and provide concrete examples to improve your answer.`;
    } else if (score >= 40) {
      return `Basic understanding demonstrated. Your answer touched on ${question.category} concepts but needs more detail, technical accuracy, and practical examples.`;
    } else {
      return `Your answer needs significant improvement. Consider studying ${question.category} fundamentals and practicing with real-world examples to better understand the concepts.`;
    }
  }

  private generateStrengths(score: number, hasKeywords: number, hasExamples: boolean, hasTechnicalTerms: boolean): string[] {
    const strengths: string[] = [];
    
    if (score >= 80) {
      strengths.push('Strong technical knowledge');
      strengths.push('Clear communication');
    }
    
    if (hasKeywords > 0.7) {
      strengths.push('Good use of relevant terminology');
    }
    
    if (hasExamples) {
      strengths.push('Provides practical examples');
    }
    
    if (hasTechnicalTerms) {
      strengths.push('Demonstrates technical depth');
    }
    
    if (score >= 60) {
      strengths.push('Shows understanding of core concepts');
    }

    return strengths.length > 0 ? strengths : ['Attempted to answer the question'];
  }

  private generateImprovements(score: number, hasKeywords: number, hasExamples: boolean, hasTechnicalTerms: boolean): string[] {
    const improvements: string[] = [];
    
    if (score < 80) {
      improvements.push('Provide more technical depth');
    }
    
    if (!hasExamples) {
      improvements.push('Include practical examples');
    }
    
    if (hasKeywords < 0.5) {
      improvements.push('Use more relevant technical terminology');
    }
    
    if (score < 70) {
      improvements.push('Study fundamental concepts more thoroughly');
    }
    
    if (score < 60) {
      improvements.push('Practice explaining concepts clearly');
      improvements.push('Focus on understanding before memorizing');
    }

    return improvements;
  }

  // Generate a comprehensive summary for the candidate
  async generateCandidateSummary(candidate: any, answers: Answer[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length;
    const strengths = answers.filter(a => a.score >= 80).length;
    const weaknesses = answers.filter(a => a.score < 60).length;

    let summary = `Candidate ${candidate.name} completed the full-stack developer interview with an average score of ${totalScore.toFixed(1)}/100. `;

    if (totalScore >= 85) {
      summary += `The candidate demonstrated exceptional technical knowledge and problem-solving abilities. They showed strong understanding across React, JavaScript, backend development, and system design. `;
      summary += `Highly recommended for senior-level positions. The candidate's responses were comprehensive, technically accurate, and included relevant examples.`;
    } else if (totalScore >= 75) {
      summary += `The candidate showed solid technical skills with good understanding of core concepts. They performed well in most areas with some room for improvement in advanced topics. `;
      summary += `Suitable for mid-level positions with potential for growth. Consider providing mentorship in areas where they scored lower.`;
    } else if (totalScore >= 65) {
      summary += `The candidate demonstrated basic to intermediate technical knowledge. While they understand fundamental concepts, they need more experience with complex implementations. `;
      summary += `Consider for junior-level positions with structured learning opportunities. Focus on practical experience and advanced concept training.`;
    } else {
      summary += `The candidate needs significant improvement in technical knowledge and problem-solving skills. Their understanding of core concepts is limited. `;
      summary += `Recommend additional training and practice before considering for development positions. Focus on fundamentals and hands-on projects.`;
    }

    summary += ` Key strengths: ${strengths} strong answers, areas for improvement: ${weaknesses} answers need work.`;

    return summary;
  }
}

export const aiService = AIService.getInstance();
