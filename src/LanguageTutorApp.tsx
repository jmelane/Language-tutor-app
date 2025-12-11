import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, differenceInDays, isToday, isYesterday, startOfDay } from 'date-fns';
import {
  Send, BookOpen, Target, TrendingUp, MessageSquare, CheckCircle,
  BarChart3, Languages, Mic, MicOff, Sun, Moon, Wifi, WifiOff,
  Flame, Award, Zap, Download, Trash2, Plus,
  X, Sparkles, Brain, Globe, Settings
} from 'lucide-react';
import { callAI, testConnection } from './apiService';
import { API_CONFIG, STORAGE_CONFIG, APP_CONFIG } from './config';
import {
  saveConversations, loadConversations, saveUserProfile, loadUserProfile,
  saveLearningGoals, loadLearningGoals, saveProgressStats, loadProgressStats,
  clearAllData, exportData,
  type Message, type UserProfile, type LearningGoal, type ProgressStats
} from './storageService';

// ============================================
// THEME CONFIGURATION
// ============================================
interface Theme {
  bg: string;
  card: string;
  cardHover: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentHover: string;
  input: string;
  button: string;
}

const themes: Record<'dark' | 'light', Theme> = {
  dark: {
    bg: 'from-slate-950 via-purple-950 to-slate-950',
    card: 'bg-white/5 backdrop-blur-xl border-white/10',
    cardHover: 'hover:bg-white/10',
    text: 'text-white',
    textMuted: 'text-purple-200',
    textSubtle: 'text-purple-300/60',
    accent: 'from-violet-600 to-fuchsia-600',
    accentHover: 'from-violet-500 to-fuchsia-500',
    input: 'bg-white/5 border-white/10 text-white placeholder-purple-300/50',
    button: 'bg-white/10 hover:bg-white/20 text-white',
  },
  light: {
    bg: 'from-slate-100 via-purple-50 to-slate-100',
    card: 'bg-white/80 backdrop-blur-xl border-purple-200/50',
    cardHover: 'hover:bg-white/90',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    textSubtle: 'text-slate-500',
    accent: 'from-violet-600 to-fuchsia-600',
    accentHover: 'from-violet-500 to-fuchsia-500',
    input: 'bg-white border-purple-200 text-slate-900 placeholder-slate-400',
    button: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
  }
};

// ============================================
// LANGUAGES CONFIGURATION
// ============================================
interface Language {
  name: string;
  native: string;
  flag: string;
  code: string;
}

const languages: Record<string, Language> = {
  spanish: { name: 'Spanish', native: 'Español', flag: '🇪🇸', code: 'es-ES' },
  french: { name: 'French', native: 'Français', flag: '🇫🇷', code: 'fr-FR' },
  german: { name: 'German', native: 'Deutsch', flag: '🇩🇪', code: 'de-DE' },
  japanese: { name: 'Japanese', native: '日本語', flag: '🇯🇵', code: 'ja-JP' },
  italian: { name: 'Italian', native: 'Italiano', flag: '🇮🇹', code: 'it-IT' },
  portuguese: { name: 'Portuguese', native: 'Português', flag: '🇵🇹', code: 'pt-PT' },
  chinese: { name: 'Chinese', native: '中文', flag: '🇨🇳', code: 'zh-CN' },
  korean: { name: 'Korean', native: '한국어', flag: '🇰🇷', code: 'ko-KR' },
  russian: { name: 'Russian', native: 'Русский', flag: '🇷🇺', code: 'ru-RU' },
  arabic: { name: 'Arabic', native: 'العربية', flag: '🇸🇦', code: 'ar-SA' },
};

// ============================================
// ACHIEVEMENTS CONFIGURATION
// ============================================
interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  requirement: number;
}

const achievementsList: Achievement[] = [
  { id: 'first_message', name: 'First Steps', desc: 'Send your first message', icon: '👋', requirement: 1 },
  { id: 'streak_3', name: 'Getting Warm', desc: '3 day streak', icon: '🔥', requirement: 3 },
  { id: 'streak_7', name: 'On Fire', desc: '7 day streak', icon: '⚡', requirement: 7 },
  { id: 'streak_30', name: 'Dedicated', desc: '30 day streak', icon: '🏆', requirement: 30 },
  { id: 'messages_10', name: 'Conversationalist', desc: 'Send 10 messages', icon: '💬', requirement: 10 },
  { id: 'messages_50', name: 'Chatterbox', desc: 'Send 50 messages', icon: '🗣️', requirement: 50 },
  { id: 'messages_100', name: 'Language Lover', desc: 'Send 100 messages', icon: '❤️', requirement: 100 },
  { id: 'vocab_25', name: 'Word Collector', desc: 'Learn 25 words', icon: '📚', requirement: 25 },
  { id: 'vocab_100', name: 'Vocabulary Master', desc: 'Learn 100 words', icon: '🎓', requirement: 100 },
  { id: 'accuracy_80', name: 'Grammar Pro', desc: 'Reach 80% accuracy', icon: '✨', requirement: 80 },
];

// ============================================
// TYPES
// ============================================
interface Feedback {
  positive?: string[];
  corrections?: string[];
  suggestions?: string[];
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayMessages: number;
  dailyGoal: number;
}

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// ============================================
// MAIN COMPONENT
// ============================================
const LanguageTutor: React.FC = () => {
  // Theme & UI State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  // Core State
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [availableModels, setAvailableModels] = useState(['llama2', 'llama3', 'mistral']);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // User Profile & Progress
  const [userProfile, setUserProfile] = useState<UserProfile>({
    proficiencyLevel: 'Beginner',
    totalMessages: 0,
    vocabularyCount: new Set(),
    grammarAccuracy: 0,
    sessionCount: 0,
    totalStudyTime: 0,
  });

  // Learning Goals
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);

  // Feedback
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Mode
  const [showLessonMode, setShowLessonMode] = useState(false);

  // Translations
  const [translatedMessages, setTranslatedMessages] = useState<Set<number>>(new Set());

  // Progress Stats
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    vocabularyGrowth: [],
    grammarAccuracy: [],
    dailyMessages: [],
  });

  // Streak & Gamification
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    todayMessages: 0,
    dailyGoal: 10,
  });

  // Achievements
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Connection Status
  const [isOnline, setIsOnline] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Voice Input
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const t = themes[theme];

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem(STORAGE_CONFIG.storageKeys.settings);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.theme) setTheme(settings.theme);
      if (settings.language) setSelectedLanguage(settings.language);
    }

    // Load user profile
    const savedProfile = loadUserProfile();
    if (savedProfile) setUserProfile(savedProfile);

    // Load progress stats
    const savedStats = loadProgressStats();
    if (savedStats) setProgressStats(savedStats);

    // Load streak data
    const savedStreak = localStorage.getItem(STORAGE_CONFIG.storageKeys.streakData);
    if (savedStreak) {
      const streak = JSON.parse(savedStreak);
      updateStreak(streak);
    }

    // Load achievements
    const savedAchievements = localStorage.getItem(STORAGE_CONFIG.storageKeys.achievements);
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    // Check speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      initSpeechRecognition();
    }

    // Fetch Ollama models
    if (API_CONFIG.provider === 'ollama') {
      fetchOllamaModels();
    }

    // Check connection
    checkConnection();

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load language-specific data
  useEffect(() => {
    const savedMessages = loadConversations(selectedLanguage);
    if (savedMessages?.length > 0) {
      setMessages(savedMessages);
    } else {
      setMessages([]);
    }

    const savedGoals = loadLearningGoals(selectedLanguage);
    if (savedGoals) {
      setLearningGoals(savedGoals);
    } else {
      setLearningGoals(generateLearningGoals(userProfile.proficiencyLevel, selectedLanguage));
    }
  }, [selectedLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save data on changes
  useEffect(() => {
    if (messages.length > 0) saveConversations(selectedLanguage, messages);
  }, [messages, selectedLanguage]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveLearningGoals(selectedLanguage, learningGoals);
  }, [learningGoals, selectedLanguage]);

  useEffect(() => {
    saveProgressStats(progressStats);
  }, [progressStats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CONFIG.storageKeys.streakData, JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CONFIG.storageKeys.achievements, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CONFIG.storageKeys.settings, JSON.stringify({
      theme, language: selectedLanguage
    }));
  }, [theme, selectedLanguage]);

  // ============================================
  // SPEECH RECOGNITION
  // ============================================
  const initSpeechRecognition = () => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;
    
    recognitionRef.current = new SpeechRecognitionClass();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setCurrentMessage(transcript);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast.error('Voice input error. Please try again.');
    };
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = languages[selectedLanguage].code;
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening... Speak now!', { icon: '🎤' });
      }
    }
  };

  // ============================================
  // CONNECTION & MODELS
  // ============================================
  const checkConnection = async () => {
    setIsConnecting(true);
    const result = await testConnection();
    setIsOnline(result.success);
    setIsConnecting(false);
  };

  const fetchOllamaModels = async () => {
    try {
      const baseUrl = API_CONFIG.ollama.endpoint.replace('/api/chat', '');
      const response = await fetch(`${baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        if (data.models?.length > 0) {
          const modelNames = [...new Set(data.models.map((m: { name: string }) => m.name.split(':')[0]))] as string[];
          setAvailableModels(modelNames);
          if (!modelNames.includes(selectedModel)) {
            setSelectedModel(modelNames[0]);
          }
        }
      }
    } catch (error) {
      console.log('Could not fetch Ollama models:', error);
    }
  };

  // ============================================
  // STREAK & ACHIEVEMENTS
  // ============================================
  const updateStreak = (currentStreakData: StreakData) => {
    const today = startOfDay(new Date());
    const lastActive = currentStreakData.lastActiveDate 
      ? startOfDay(new Date(currentStreakData.lastActiveDate))
      : null;

    let newStreak = currentStreakData.currentStreak;
    let todayMsgs = currentStreakData.todayMessages;

    if (lastActive) {
      const daysDiff = differenceInDays(today, lastActive);
      if (daysDiff === 0) {
        // Same day, keep streak
      } else if (daysDiff === 1) {
        // Yesterday, increment streak
        newStreak += 1;
        todayMsgs = 0;
      } else {
        // Streak broken
        newStreak = 0;
        todayMsgs = 0;
      }
    }

    setStreakData({
      ...currentStreakData,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentStreakData.longestStreak),
      todayMessages: todayMsgs,
    });
  };

  const checkAchievements = useCallback((profile: UserProfile, streak: StreakData) => {
    const newUnlocked: string[] = [];

    achievementsList.forEach(achievement => {
      if (achievements.includes(achievement.id)) return;

      let unlocked = false;
      switch (achievement.id) {
        case 'first_message':
          unlocked = profile.totalMessages >= 1;
          break;
        case 'streak_3':
          unlocked = streak.currentStreak >= 3;
          break;
        case 'streak_7':
          unlocked = streak.currentStreak >= 7;
          break;
        case 'streak_30':
          unlocked = streak.currentStreak >= 30;
          break;
        case 'messages_10':
          unlocked = profile.totalMessages >= 10;
          break;
        case 'messages_50':
          unlocked = profile.totalMessages >= 50;
          break;
        case 'messages_100':
          unlocked = profile.totalMessages >= 100;
          break;
        case 'vocab_25':
          unlocked = profile.vocabularyCount.size >= 25;
          break;
        case 'vocab_100':
          unlocked = profile.vocabularyCount.size >= 100;
          break;
        case 'accuracy_80':
          unlocked = profile.grammarAccuracy >= 80;
          break;
        default:
          break;
      }

      if (unlocked) {
        newUnlocked.push(achievement.id);
        setNewAchievement(achievement);
        toast.success(`Achievement unlocked: ${achievement.name}!`, {
          icon: achievement.icon,
          duration: 4000,
        });
      }
    });

    if (newUnlocked.length > 0) {
      setAchievements(prev => [...prev, ...newUnlocked]);
    }
  }, [achievements]);

  // ============================================
  // LEARNING GOALS
  // ============================================
  const generateLearningGoals = (level: string, _language: string): LearningGoal[] => {
    const goalsByLevel: Record<string, string[]> = {
      Beginner: [
        'Master basic greetings and introductions',
        'Learn present tense verbs',
        'Build essential vocabulary (100 words)',
        'Practice numbers and counting',
        'Use basic question words',
      ],
      Intermediate: [
        'Master past tenses',
        'Learn conditional sentences',
        'Expand vocabulary to 500 words',
        'Practice complex conversations',
        'Understand idioms and expressions',
      ],
      Advanced: [
        'Master subjunctive mood',
        'Perfect pronunciation',
        'Learn professional vocabulary',
        'Understand cultural nuances',
        'Practice debate and argumentation',
      ],
    };

    const goals = goalsByLevel[level] || goalsByLevel.Beginner;
    return goals.slice(0, 3).map((text, index) => ({
      id: Date.now() + index,
      text,
      completed: false,
      progress: Math.floor(Math.random() * 30),
    }));
  };

  const addCustomGoal = () => {
    if (!newGoalText.trim()) return;
    
    const newGoal: LearningGoal = {
      id: Date.now(),
      text: newGoalText.trim(),
      completed: false,
      progress: 0,
    };
    setLearningGoals(prev => [...prev, newGoal]);
    setNewGoalText('');
    setAddGoalOpen(false);
    toast.success('Goal added!', { icon: '🎯' });
  };

  const toggleGoalCompletion = (goalId: number) => {
    setLearningGoals(prev =>
      prev.map(goal =>
        goal.id === goalId
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
          : goal
      )
    );
  };

  const removeGoal = (goalId: number) => {
    setLearningGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // ============================================
  // MESSAGE HANDLING
  // ============================================
  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const detectedLevel = analyzeProficiencyLevel(conversationHistory);

      const prompt = `
You are a friendly, encouraging ${languages[selectedLanguage].name} language tutor.

Conversation history: ${JSON.stringify(conversationHistory.slice(-5).map(m => ({ sender: m.sender, text: m.text })))}

Current user message: "${userMessage.text}"
User's proficiency level: ${detectedLevel}
Learning goals: ${learningGoals.map(g => g.text).join(', ')}
Mode: ${showLessonMode ? 'Lesson (teach grammar/vocabulary)' : 'Conversation (natural practice)'}

Respond with a JSON object in this exact format:
{
  "tutorResponse": "Your encouraging response in ${languages[selectedLanguage].name}",
  "englishTranslation": "English translation",
  "feedback": {
    "positive": ["Positive feedback"],
    "corrections": ["Corrections if needed"],
    "suggestions": ["Helpful tips"]
  },
  "grammarAnalysis": {
    "accuracy": 85,
    "detectedLevel": "${detectedLevel}",
    "strengths": ["Good points"],
    "improvements": ["Areas to improve"]
  },
  "vocabularyUsed": ["words", "used"],
  "progressNotes": "Brief encouraging note"
}

Respond ONLY with valid JSON.`;

      const response = await callAI(prompt, selectedModel);
      const parsedResponse = JSON.parse(response);

      const tutorMessage: Message = {
        id: Date.now() + 1,
        text: parsedResponse.tutorResponse,
        englishTranslation: parsedResponse.englishTranslation,
        sender: 'tutor',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, tutorMessage]);
      setFeedback(parsedResponse.feedback);

      // Update profile
      const newVocab = new Set([...userProfile.vocabularyCount, ...(parsedResponse.vocabularyUsed || [])]);
      const newProfile: UserProfile = {
        ...userProfile,
        totalMessages: userProfile.totalMessages + 1,
        proficiencyLevel: parsedResponse.grammarAnalysis?.detectedLevel || userProfile.proficiencyLevel,
        grammarAccuracy: parsedResponse.grammarAnalysis?.accuracy || userProfile.grammarAccuracy,
        vocabularyCount: newVocab,
      };
      setUserProfile(newProfile);

      // Update streak
      const newStreakData: StreakData = {
        ...streakData,
        todayMessages: streakData.todayMessages + 1,
        lastActiveDate: new Date().toISOString(),
        currentStreak: isToday(new Date(streakData.lastActiveDate || 0)) || isYesterday(new Date(streakData.lastActiveDate || 0))
          ? streakData.currentStreak
          : streakData.currentStreak + 1,
        longestStreak: streakData.longestStreak,
        dailyGoal: streakData.dailyGoal,
      };
      setStreakData(newStreakData);

      // Check achievements
      checkAchievements(newProfile, newStreakData);

      // Update progress stats
      const today = format(new Date(), 'MMM dd');
      setProgressStats(prev => ({
        vocabularyGrowth: [...prev.vocabularyGrowth.slice(-6), { date: today, count: newVocab.size }],
        grammarAccuracy: [...prev.grammarAccuracy.slice(-6), { date: today, accuracy: parsedResponse.grammarAnalysis?.accuracy || 75 }],
        dailyMessages: [...prev.dailyMessages.slice(-6), { date: today, messages: (prev.dailyMessages[prev.dailyMessages.length - 1]?.messages || 0) + 1 }],
      }));

    } catch (error) {
      console.error('Error:', error);
      toast.error((error as Error).message || 'Failed to get response');
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm having trouble connecting. Please check your connection and try again!",
        sender: 'tutor',
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeProficiencyLevel = (messageHistory: Message[]): string => {
    const count = messageHistory.filter(m => m.sender === 'user').length;
    if (count < 10) return 'Beginner';
    if (count < 30) return 'Intermediate';
    return 'Advanced';
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setMessages([]);
    setFeedback(null);
    setTranslatedMessages(new Set());
    toast.success(`Switched to ${languages[lang].name}!`, { icon: languages[lang].flag });
  };

  const toggleMessageTranslation = (messageId: number) => {
    setTranslatedMessages(prev => {
      const newSet = new Set(prev);
      newSet.has(messageId) ? newSet.delete(messageId) : newSet.add(messageId);
      return newSet;
    });
  };

  // ============================================
  // DATA MANAGEMENT
  // ============================================
  const handleExportData = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `language-tutor-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!', { icon: '📥' });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Clear all data? This cannot be undone.')) {
      clearAllData();
      setMessages([]);
      setUserProfile({
        proficiencyLevel: 'Beginner',
        totalMessages: 0,
        vocabularyCount: new Set(),
        grammarAccuracy: 0,
        sessionCount: 0,
        totalStudyTime: 0,
      });
      setLearningGoals(generateLearningGoals('Beginner', selectedLanguage));
      setProgressStats({ vocabularyGrowth: [], grammarAccuracy: [], dailyMessages: [] });
      setStreakData({ currentStreak: 0, longestStreak: 0, lastActiveDate: null, todayMessages: 0, dailyGoal: 10 });
      setAchievements([]);
      setFeedback(null);
      toast.success('All data cleared!', { icon: '🗑️' });
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const getProficiencyConfig = (level: string) => ({
    Beginner: { color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    Intermediate: { color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20', text: 'text-amber-400' },
    Advanced: { color: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/20', text: 'text-rose-400' },
  })[level] || { color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };

  const chartColors = theme === 'dark' 
    ? { stroke: '#a855f7', fill: '#a855f7' }
    : { stroke: '#7c3aed', fill: '#7c3aed' };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bg} transition-all duration-500`}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-slate-800 !text-white !border !border-white/10',
          duration: 3000,
        }}
      />

      {/* Achievement Popup */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-2">{newAchievement.icon}</div>
                <h3 className="text-xl font-bold text-white">{newAchievement.name}</h3>
                <p className="text-amber-100 text-sm">{newAchievement.desc}</p>
              </div>
              <button
                onClick={() => setNewAchievement(null)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`${t.card} rounded-3xl p-6 max-w-md w-full border shadow-2xl`}
            >
              <h2 className={`text-2xl font-bold ${t.text} mb-6`}>Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${t.textMuted} mb-2`}>Daily Goal</label>
                  <input
                    type="number"
                    value={streakData.dailyGoal}
                    onChange={(e) => setStreakData(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 10 }))}
                    className={`w-full px-4 py-2 rounded-xl ${t.input} border`}
                    min="1"
                    max="100"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleExportData}
                    className={`flex-1 py-3 px-4 rounded-xl ${t.button} flex items-center justify-center gap-2`}
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setSettingsOpen(false)}
                className={`w-full mt-6 py-3 rounded-xl bg-gradient-to-r ${t.accent} text-white font-semibold`}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {addGoalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAddGoalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`${t.card} rounded-3xl p-6 max-w-md w-full border shadow-2xl`}
            >
              <h2 className={`text-xl font-bold ${t.text} mb-4`}>Add Learning Goal</h2>
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
                placeholder="e.g., Master past tense verbs"
                className={`w-full px-4 py-3 rounded-xl ${t.input} border mb-4`}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setAddGoalOpen(false)}
                  className={`flex-1 py-3 rounded-xl ${t.button}`}
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomGoal}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${t.accent} text-white font-semibold`}
                >
                  Add Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${t.card} border-b m-4 mb-0 rounded-2xl`}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.accent} flex items-center justify-center`}>
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className={`text-xl font-bold ${t.text}`}>{APP_CONFIG.name}</h1>
                      <p className={`text-xs ${t.textSubtle}`}>v{APP_CONFIG.version}</p>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className={`appearance-none pl-10 pr-8 py-2 rounded-xl ${t.input} border cursor-pointer`}
                    >
                      {Object.entries(languages).map(([code, lang]) => (
                        <option key={code} value={code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                    <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`} />
                  </div>

                  {/* Model Selector */}
                  {API_CONFIG.provider === 'ollama' && (
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={`px-4 py-2 rounded-xl ${t.input} border cursor-pointer`}
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          🤖 {model}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Proficiency Badge */}
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getProficiencyConfig(userProfile.proficiencyLevel).bg} ${getProficiencyConfig(userProfile.proficiencyLevel).text}`}>
                    {userProfile.proficiencyLevel}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Connection Status */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isConnecting ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isOnline ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{isOnline ? 'Connected' : 'Offline'}</span>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-bold">{streakData.currentStreak}</span>
                  </div>

                  {/* Mode Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLessonMode(!showLessonMode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      showLessonMode
                        ? `bg-gradient-to-r ${t.accent} text-white`
                        : t.button
                    }`}
                  >
                    {showLessonMode ? '📚 Lesson' : '💬 Chat'}
                  </motion.button>

                  {/* Theme Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`p-2 rounded-xl ${t.button}`}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.button>

                  {/* Settings */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSettingsOpen(true)}
                    className={`p-2 rounded-xl ${t.button}`}
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">{languages[selectedLanguage].flag}</div>
                <h2 className={`text-2xl font-bold ${t.text} mb-3`}>
                  Ready to practice {languages[selectedLanguage].name}?
                </h2>
                <p className={`${t.textMuted} max-w-md mx-auto mb-8`}>
                  Start a conversation and I'll help you learn with personalized feedback, grammar corrections, and vocabulary building!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Hello!', 'How are you?', 'Nice to meet you'].map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentMessage(suggestion)}
                      className={`px-4 py-2 rounded-xl ${t.card} border ${t.text} text-sm`}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`max-w-lg px-5 py-3 rounded-2xl relative group cursor-pointer ${
                      message.sender === 'user'
                        ? `bg-gradient-to-r ${t.accent} text-white`
                        : message.isError
                          ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                          : `${t.card} border ${t.text}`
                    }`}
                    onClick={message.sender === 'tutor' ? () => toggleMessageTranslation(message.id) : undefined}
                  >
                    {message.sender === 'tutor' && !message.isError && (
                      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Languages className={`w-4 h-4 ${t.textMuted}`} />
                      </div>
                    )}
                    <p className="leading-relaxed">
                      {message.sender === 'tutor' && translatedMessages.has(message.id)
                        ? message.englishTranslation || message.text
                        : message.text}
                    </p>
                    {message.sender === 'tutor' && translatedMessages.has(message.id) && (
                      <p className={`text-xs mt-2 ${t.textSubtle} italic`}>English translation</p>
                    )}
                    <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/60' : t.textSubtle}`}>
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className={`${t.card} border rounded-2xl px-5 py-3`}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 h-2 rounded-full bg-purple-500"
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${t.textMuted}`}>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`${t.card} border rounded-2xl p-4`}
            >
              {/* Daily Progress */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className={`text-sm ${t.textMuted}`}>
                    Today: {streakData.todayMessages}/{streakData.dailyGoal} messages
                  </span>
                </div>
                <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((streakData.todayMessages / streakData.dailyGoal) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
                {streakData.todayMessages >= streakData.dailyGoal && (
                  <span className="text-amber-500 text-sm">🎉 Goal reached!</span>
                )}
              </div>

              <div className="flex gap-3">
                {/* Voice Input */}
                {speechSupported && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoiceInput}
                    className={`p-3 rounded-xl transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : t.button
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                )}

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Type in ${languages[selectedLanguage].name}...`}
                  className={`flex-1 px-4 py-3 rounded-xl ${t.input} border focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                  disabled={isLoading}
                />

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className={`p-3 rounded-xl bg-gradient-to-r ${t.accent} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`w-80 ${t.card} border-l m-4 ml-0 rounded-2xl flex flex-col overflow-hidden`}
        >
          {/* Stats Overview */}
          <div className="p-5 border-b border-white/10">
            <h3 className={`font-semibold ${t.text} mb-4 flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Progress Overview
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-purple-100/50'} text-center`}>
                <MessageSquare className={`w-5 h-5 mx-auto mb-1 ${t.textMuted}`} />
                <div className={`text-lg font-bold ${t.text}`}>{userProfile.totalMessages}</div>
                <div className={`text-xs ${t.textSubtle}`}>Messages</div>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-purple-100/50'} text-center`}>
                <BookOpen className={`w-5 h-5 mx-auto mb-1 ${t.textMuted}`} />
                <div className={`text-lg font-bold ${t.text}`}>{userProfile.vocabularyCount.size}</div>
                <div className={`text-xs ${t.textSubtle}`}>Words</div>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-purple-100/50'} text-center`}>
                <Sparkles className={`w-5 h-5 mx-auto mb-1 ${t.textMuted}`} />
                <div className={`text-lg font-bold ${t.text}`}>{userProfile.grammarAccuracy}%</div>
                <div className={`text-xs ${t.textSubtle}`}>Accuracy</div>
              </div>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${t.text} flex items-center gap-2`}>
                <Target className="w-5 h-5 text-emerald-500" />
                Learning Goals
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAddGoalOpen(true)}
                className={`p-1.5 rounded-lg ${t.button}`}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {learningGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  layout
                  className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-purple-100/30'} group`}
                >
                  <div className="flex items-start gap-2">
                    <button onClick={() => toggleGoalCompletion(goal.id)}>
                      {goal.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      ) : (
                        <div className={`w-4 h-4 border-2 ${theme === 'dark' ? 'border-white/30' : 'border-purple-300'} rounded-full mt-0.5`} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${goal.completed ? 'line-through' : ''} ${t.text} truncate`}>{goal.text}</p>
                      <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className={`w-4 h-4 ${t.textSubtle}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-5 border-b border-white/10 overflow-hidden"
              >
                <h3 className={`font-semibold ${t.text} mb-3 flex items-center gap-2`}>
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Feedback
                </h3>
                <div className="space-y-2">
                  {feedback.positive && feedback.positive.length > 0 && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-medium text-emerald-400 mb-1">✨ Great job!</p>
                      <p className="text-sm text-emerald-300">{feedback.positive[0]}</p>
                    </div>
                  )}
                  {feedback.corrections && feedback.corrections.length > 0 && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-medium text-amber-400 mb-1">📝 Correction</p>
                      <p className="text-sm text-amber-300">{feedback.corrections[0]}</p>
                    </div>
                  )}
                  {feedback.suggestions && feedback.suggestions.length > 0 && (
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs font-medium text-blue-400 mb-1">💡 Tip</p>
                      <p className="text-sm text-blue-300">{feedback.suggestions[0]}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charts */}
          <div className="flex-1 p-5 overflow-auto">
            <h3 className={`font-semibold ${t.text} mb-4 flex items-center gap-2`}>
              <BarChart3 className="w-5 h-5 text-violet-500" />
              Learning Stats
            </h3>
            
            {progressStats.vocabularyGrowth.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <p className={`text-xs ${t.textMuted} mb-2`}>Vocabulary Growth</p>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressStats.vocabularyGrowth}>
                        <defs>
                          <linearGradient id="vocabGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors.fill} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartColors.fill} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#a5b4fc' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke={chartColors.stroke}
                          fill="url(#vocabGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <p className={`text-xs ${t.textMuted} mb-2`}>Grammar Accuracy</p>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={progressStats.grammarAccuracy}>
                        <defs>
                          <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ background: '#1e1b4b', border: 'none', borderRadius: '8px' }}
                          labelStyle={{ color: '#a5b4fc' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#10b981"
                          fill="url(#accuracyGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${t.textSubtle}`}>
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start chatting to see your stats!</p>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="p-5 border-t border-white/10">
            <h3 className={`font-semibold ${t.text} mb-3 flex items-center gap-2`}>
              <Award className="w-5 h-5 text-amber-500" />
              Achievements
              <span className={`text-xs ${t.textSubtle}`}>
                {achievements.length}/{achievementsList.length}
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {achievementsList.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                    achievements.includes(achievement.id)
                      ? 'bg-amber-500/20'
                      : theme === 'dark' ? 'bg-white/5 grayscale opacity-30' : 'bg-purple-100/50 grayscale opacity-30'
                  }`}
                  title={`${achievement.name}: ${achievement.desc}`}
                >
                  {achievement.icon}
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default LanguageTutor;

