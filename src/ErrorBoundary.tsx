import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  isRecovering: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Auto-recovery attempt
    this.attemptRecovery();
  }

  attemptRecovery = (): void => {
    const { retryCount } = this.state;
    const maxRetries = 3;

    if (retryCount < maxRetries) {
      this.setState({ isRecovering: true });
      
      setTimeout(() => {
        // Clear any corrupted localStorage data that might cause issues
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('languageTutor_')) {
              const data = localStorage.getItem(key);
              if (data) {
                try {
                  JSON.parse(data);
                } catch {
                  console.warn(`Removing corrupted data: ${key}`);
                  localStorage.removeItem(key);
                }
              }
            }
          });
        } catch (e) {
          console.error('Failed to clean localStorage:', e);
        }

        this.setState(prev => ({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: prev.retryCount + 1,
          isRecovering: false
        }));
      }, 1500);
    }
  };

  handleManualRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    });
  };

  handleClearAndRetry = (): void => {
    // Clear all app data and retry
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('languageTutor_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
    
    this.handleManualRetry();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { isRecovering, retryCount, error } = this.state;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              {isRecovering ? (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full"
                  />
                  <h2 className="text-xl font-bold text-white mb-2">Auto-Recovering...</h2>
                  <p className="text-purple-200">Attempting to fix the issue automatically</p>
                  <p className="text-sm text-purple-300 mt-2">Attempt {retryCount + 1} of 3</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-purple-200 text-sm">
                      {retryCount >= 3 
                        ? "Auto-recovery failed. Please try the options below."
                        : "Don't worry, we're trying to fix it automatically."}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-black/30 rounded-xl p-4 mb-6 overflow-hidden">
                      <p className="text-xs text-purple-300 font-mono truncate">
                        {error.toString()}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={this.handleManualRetry}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                    >
                      🔄 Try Again
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={this.handleClearAndRetry}
                      className="w-full py-3 px-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                    >
                      🗑️ Clear Data & Restart
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.reload()}
                      className="w-full py-3 px-4 bg-white/5 text-purple-300 font-medium rounded-xl hover:bg-white/10 transition-all"
                    >
                      ↻ Refresh Page
                    </motion.button>
                  </div>

                  <p className="text-center text-purple-400 text-xs mt-6">
                    Your learning progress is safely stored locally
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

