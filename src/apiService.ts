// API Service for Language Tutor
// Enhanced with retry logic, error handling, and connection management

import { API_CONFIG } from './config';

// Types
export interface ConnectionStatus {
  isOnline: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  provider: string;
}

interface ParsedAIResponse {
  tutorResponse: string;
  englishTranslation: string;
  feedback: {
    positive: string[];
    corrections: string[];
    suggestions: string[];
  };
  grammarAnalysis: {
    accuracy: number;
    detectedLevel: string;
    strengths: string[];
    improvements: string[];
  };
  vocabularyUsed: string[];
  progressNotes: string;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// Connection status tracking
let connectionStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastCheck: Date.now(),
  consecutiveFailures: 0,
};

// Update connection status on network changes
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    connectionStatus.isOnline = true;
    connectionStatus.consecutiveFailures = 0;
  });
  window.addEventListener('offline', () => {
    connectionStatus.isOnline = false;
  });
}

/**
 * Get current connection status
 */
export const getConnectionStatus = (): ConnectionStatus => ({
  ...connectionStatus,
  provider: API_CONFIG.provider,
});

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number): number => {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
};

/**
 * Parse AI response, handling various formats
 */
const parseAIResponse = (response: string): ParsedAIResponse => {
  // Try to find JSON in the response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      console.warn('Failed to parse JSON from response, using fallback');
    }
  }
  
  // Fallback: return a structured response from plain text
  return {
    tutorResponse: response,
    englishTranslation: '',
    feedback: {
      positive: ['Keep practicing!'],
      corrections: [],
      suggestions: ['Try to use more vocabulary']
    },
    grammarAnalysis: {
      accuracy: 75,
      detectedLevel: 'Beginner',
      strengths: ['Good effort'],
      improvements: ['Keep practicing']
    },
    vocabularyUsed: [],
    progressNotes: 'Keep up the good work!'
  };
};

/**
 * Makes an API call to the configured AI provider with retry logic
 */
export const callAI = async (prompt: string, customModel: string | null = null): Promise<string> => {
  const provider = API_CONFIG.provider;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      let response: string;
      
      if (provider === 'ollama') {
        response = await callOllama(prompt, customModel);
      } else if (provider === 'openai') {
        response = await callOpenAI(prompt, customModel);
      } else if (provider === 'anthropic') {
        response = await callAnthropic(prompt, customModel);
      } else if (provider === 'custom') {
        response = await callCustomAPI(prompt);
      } else {
        throw new Error(`Unknown provider: ${provider}`);
      }
      
      // Success - reset failure counter
      connectionStatus.consecutiveFailures = 0;
      connectionStatus.lastCheck = Date.now();
      
      return response;
    } catch (error) {
      lastError = error as Error;
      connectionStatus.consecutiveFailures++;
      connectionStatus.lastCheck = Date.now();
      
      console.warn(`API call attempt ${attempt + 1} failed:`, (error as Error).message);
      
      // Don't retry on certain errors
      if ((error as Error).message.includes('API key not configured') ||
          (error as Error).message.includes('Unknown provider')) {
        throw error;
      }
      
      // Wait before retrying (if not the last attempt)
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  // All retries failed
  throw new Error(`Failed after ${RETRY_CONFIG.maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Call Ollama API (Local AI - FREE!)
 */
const callOllama = async (prompt: string, customModel: string | null = null): Promise<string> => {
  const config = API_CONFIG.ollama;
  const modelToUse = customModel || config.model;
  
  console.log('Calling Ollama at:', config.endpoint, 'with model:', modelToUse);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
  
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1024,
        }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.message?.content || data.response || '';
    
    // Try to parse as JSON, fallback to raw response
    try {
      return JSON.stringify(parseAIResponse(content));
    } catch {
      return content;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if ((error as Error).message.includes('Failed to fetch') || (error as Error).message.includes('NetworkError')) {
      throw new Error(`Cannot connect to Ollama. Make sure it's running at ${config.endpoint}`);
    }
    
    throw error;
  }
};

/**
 * Call OpenAI API
 */
const callOpenAI = async (prompt: string, customModel: string | null = null): Promise<string> => {
  const config = API_CONFIG.openai;
  const modelToUse = customModel || config.model;
  
  if (!config.apiKey || config.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('OpenAI API key not configured. Please add your API key in src/config.ts');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        throw new Error('Rate limited. Please wait a moment before trying again.');
      }
      
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Call Anthropic Claude API
 */
const callAnthropic = async (prompt: string, customModel: string | null = null): Promise<string> => {
  const config = API_CONFIG.anthropic;
  const modelToUse = customModel || config.model;
  
  if (!config.apiKey || config.apiKey === 'YOUR_ANTHROPIC_API_KEY_HERE') {
    throw new Error('Anthropic API key not configured. Please add your API key in src/config.ts');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelToUse,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        throw new Error('Rate limited. Please wait a moment before trying again.');
      }
      
      throw new Error(`Anthropic API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Call Custom API
 */
const callCustomAPI = async (prompt: string): Promise<string> => {
  const config = API_CONFIG.custom;
  
  if (!config.apiKey || config.apiKey === 'YOUR_CUSTOM_API_KEY_HERE') {
    throw new Error('Custom API key not configured. Please add your API key in src/config.ts');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Custom API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || data.content;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Test connection to the AI provider
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const testPrompt = 'Respond with just the word "OK"';
    await callAI(testPrompt);
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

