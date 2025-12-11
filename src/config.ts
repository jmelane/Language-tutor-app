// API Configuration
// ===================
// This file contains the configuration for the AI API used in the Language Tutor app.

// Get environment variables with fallbacks (Vite uses import.meta.env)
const getEnvVar = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteKey = key.replace('REACT_APP_', 'VITE_');
    return (import.meta.env as Record<string, string>)[viteKey] || fallback;
  }
  return fallback;
};

export interface OllamaConfig {
  endpoint: string;
  model: string;
}

export interface OpenAIConfig {
  apiKey: string;
  endpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface AnthropicConfig {
  apiKey: string;
  endpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface CustomConfig {
  apiKey: string;
  endpoint: string;
  headers: Record<string, string>;
}

export interface APIConfigType {
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom';
  ollama: OllamaConfig;
  openai: OpenAIConfig;
  anthropic: AnthropicConfig;
  custom: CustomConfig;
}

export const API_CONFIG: APIConfigType = {
  // ============================================
  // ACTIVE PROVIDER (change this to switch)
  // ============================================
  provider: getEnvVar('REACT_APP_API_PROVIDER', 'ollama') as APIConfigType['provider'],
  
  // ============================================
  // OPTION 1: Ollama (Local AI - FREE!)
  // ============================================
  ollama: {
    endpoint: getEnvVar('REACT_APP_OLLAMA_ENDPOINT', 'http://localhost:11434/api/chat'),
    model: getEnvVar('REACT_APP_OLLAMA_MODEL', 'llama2'),
  },

  // ============================================
  // OPTION 2: OpenAI
  // ============================================
  openai: {
    apiKey: getEnvVar('REACT_APP_OPENAI_API_KEY', 'YOUR_OPENAI_API_KEY_HERE'),
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: getEnvVar('REACT_APP_OPENAI_MODEL', 'gpt-4'),
    maxTokens: 1000,
    temperature: 0.7,
  },

  // ============================================
  // OPTION 3: Anthropic Claude
  // ============================================
  anthropic: {
    apiKey: getEnvVar('REACT_APP_ANTHROPIC_API_KEY', 'YOUR_ANTHROPIC_API_KEY_HERE'),
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: getEnvVar('REACT_APP_ANTHROPIC_MODEL', 'claude-3-sonnet-20240229'),
    maxTokens: 1000,
    temperature: 0.7,
  },

  // ============================================
  // OPTION 4: Custom API Endpoint
  // ============================================
  custom: {
    apiKey: getEnvVar('REACT_APP_CUSTOM_API_KEY', 'YOUR_CUSTOM_API_KEY_HERE'),
    endpoint: getEnvVar('REACT_APP_CUSTOM_ENDPOINT', 'https://your-custom-endpoint.com/api/chat'),
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// ============================================
// LocalStorage Configuration
// ============================================
export interface StorageConfigType {
  enablePersistence: boolean;
  storageKeys: {
    conversations: string;
    userProfile: string;
    learningGoals: string;
    progressStats: string;
    streakData: string;
    achievements: string;
    settings: string;
    sessionHistory: string;
  };
  maxStoredMessages: number;
  maxSessionHistory: number;
}

export const STORAGE_CONFIG: StorageConfigType = {
  enablePersistence: true,
  storageKeys: {
    conversations: 'languageTutor_conversations',
    userProfile: 'languageTutor_userProfile',
    learningGoals: 'languageTutor_learningGoals',
    progressStats: 'languageTutor_progressStats',
    streakData: 'languageTutor_streakData',
    achievements: 'languageTutor_achievements',
    settings: 'languageTutor_settings',
    sessionHistory: 'languageTutor_sessionHistory',
  },
  maxStoredMessages: 500,
  maxSessionHistory: 100,
};

// ============================================
// App Configuration
// ============================================
export interface AppConfigType {
  version: string;
  name: string;
  description: string;
  features: {
    voiceInput: boolean;
    darkMode: boolean;
    streakTracking: boolean;
    achievements: boolean;
    offlineSupport: boolean;
    analytics: boolean;
  };
  defaults: {
    language: string;
    theme: string;
    dailyGoal: number;
  };
}

export const APP_CONFIG: AppConfigType = {
  version: '2.0.0',
  name: 'Language Tutor',
  description: 'AI-powered language learning assistant',
  features: {
    voiceInput: true,
    darkMode: true,
    streakTracking: true,
    achievements: true,
    offlineSupport: true,
    analytics: true,
  },
  defaults: {
    language: 'spanish',
    theme: 'dark',
    dailyGoal: 10,
  },
};

