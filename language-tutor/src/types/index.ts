export type Language = 'Spanish' | 'French' | 'German' | 'Japanese' | 'Italian';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: Feedback;
}

export interface Feedback {
  corrections: Correction[];
  suggestions: string[];
  positivePoints: string[];
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'vocabulary' | 'syntax';
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserStats {
  points: number;
  level: ProficiencyLevel;
  badges: Badge[];
  vocabularyCount: number;
  grammarScore: number; // 0-100
  lessonsCompleted: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  earnedDate: number;
}

export type ProficiencyLevel = 'Novice' | 'Intermediate' | 'Advanced';
