// Storage Service for Language Tutor
// This service handles saving and loading data to/from localStorage

import { STORAGE_CONFIG } from './config';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  englishTranslation?: string;
  isError?: boolean;
}

export interface UserProfile {
  proficiencyLevel: string;
  totalMessages: number;
  vocabularyCount: Set<string>;
  grammarAccuracy: number;
  sessionCount: number;
  totalStudyTime: number;
}

export interface LearningGoal {
  id: number;
  text: string;
  completed: boolean;
  progress: number;
}

export interface ProgressStats {
  vocabularyGrowth: Array<{ date: string; count: number }>;
  grammarAccuracy: Array<{ date: string; accuracy: number }>;
  dailyMessages: Array<{ date: string; messages: number }>;
}

/**
 * Save conversations to localStorage
 */
export const saveConversations = (language: string, messages: Message[]): void => {
  if (!STORAGE_CONFIG.enablePersistence) return;
  
  try {
    const key = `${STORAGE_CONFIG.storageKeys.conversations}_${language}`;
    const limitedMessages = messages.slice(-STORAGE_CONFIG.maxStoredMessages);
    localStorage.setItem(key, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Failed to save conversations:', error);
  }
};

/**
 * Load conversations from localStorage
 */
export const loadConversations = (language: string): Message[] => {
  if (!STORAGE_CONFIG.enablePersistence) return [];
  
  try {
    const key = `${STORAGE_CONFIG.storageKeys.conversations}_${language}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const messages = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return messages.map((msg: Message & { timestamp: string | Date }) => ({
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }));
  } catch (error) {
    console.error('Failed to load conversations:', error);
    return [];
  }
};

interface StoredUserProfile extends Omit<UserProfile, 'vocabularyCount'> {
  vocabularyCount: string[];
}

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile: UserProfile): void => {
  if (!STORAGE_CONFIG.enablePersistence) return;
  
  try {
    // Convert Set to Array for storage
    const profileToSave: StoredUserProfile = {
      ...profile,
      vocabularyCount: Array.from(profile.vocabularyCount),
    };
    localStorage.setItem(
      STORAGE_CONFIG.storageKeys.userProfile,
      JSON.stringify(profileToSave)
    );
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
};

/**
 * Load user profile from localStorage
 */
export const loadUserProfile = (): UserProfile | null => {
  if (!STORAGE_CONFIG.enablePersistence) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_CONFIG.storageKeys.userProfile);
    if (!data) return null;
    
    const profile: StoredUserProfile = JSON.parse(data);
    // Convert Array back to Set
    return {
      ...profile,
      vocabularyCount: new Set(profile.vocabularyCount),
    };
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
};

/**
 * Save learning goals to localStorage
 */
export const saveLearningGoals = (language: string, goals: LearningGoal[]): void => {
  if (!STORAGE_CONFIG.enablePersistence) return;
  
  try {
    const key = `${STORAGE_CONFIG.storageKeys.learningGoals}_${language}`;
    localStorage.setItem(key, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save learning goals:', error);
  }
};

/**
 * Load learning goals from localStorage
 */
export const loadLearningGoals = (language: string): LearningGoal[] | null => {
  if (!STORAGE_CONFIG.enablePersistence) return null;
  
  try {
    const key = `${STORAGE_CONFIG.storageKeys.learningGoals}_${language}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load learning goals:', error);
    return null;
  }
};

/**
 * Save progress stats to localStorage
 */
export const saveProgressStats = (stats: ProgressStats): void => {
  if (!STORAGE_CONFIG.enablePersistence) return;
  
  try {
    localStorage.setItem(
      STORAGE_CONFIG.storageKeys.progressStats,
      JSON.stringify(stats)
    );
  } catch (error) {
    console.error('Failed to save progress stats:', error);
  }
};

/**
 * Load progress stats from localStorage
 */
export const loadProgressStats = (): ProgressStats | null => {
  if (!STORAGE_CONFIG.enablePersistence) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_CONFIG.storageKeys.progressStats);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load progress stats:', error);
    return null;
  }
};

/**
 * Clear all stored data
 */
export const clearAllData = (): boolean => {
  try {
    Object.values(STORAGE_CONFIG.storageKeys).forEach(key => {
      // Clear base keys
      localStorage.removeItem(key);
      
      // Clear language-specific keys
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(storageKey => {
        if (storageKey.startsWith(key)) {
          localStorage.removeItem(storageKey);
        }
      });
    });
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
};

/**
 * Export all data (for backup)
 */
export const exportData = (): string | null => {
  try {
    const data: Record<string, string | null> = {};
    Object.values(STORAGE_CONFIG.storageKeys).forEach(key => {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(storageKey => {
        if (storageKey.startsWith(key) || storageKey === key) {
          data[storageKey] = localStorage.getItem(storageKey);
        }
      });
    });
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    return null;
  }
};

/**
 * Import data (from backup)
 */
export const importData = (jsonData: string): boolean => {
  try {
    const data: Record<string, string> = JSON.parse(jsonData);
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

