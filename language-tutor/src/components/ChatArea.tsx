import React, { useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { Send, Loader2, BookOpen, Coffee } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface Props {
  messages: Message[];
  language: Language;
  setLanguage: (l: Language) => void;
  mode: 'casual' | 'structured';
  setMode: (m: 'casual' | 'structured') => void;
  input: string;
  setInput: (s: string) => void;
  sendMessage: (s: string) => void;
  isLoading: boolean;
}

export const ChatArea: React.FC<Props> = ({
  messages,
  language,
  setLanguage,
  mode,
  setMode,
  input,
  setInput,
  sendMessage,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/95 backdrop-blur z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-200 hidden md:block">Practice Session</h2>
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
             <button 
                onClick={() => setMode('casual')}
                className={`p-2 rounded-md transition-colors ${mode === 'casual' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                title="Casual Mode"
             >
                <Coffee className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setMode('structured')}
                className={`p-2 rounded-md transition-colors ${mode === 'structured' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                title="Structured Mode"
             >
                <BookOpen className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="w-48">
          <LanguageSelector current={language} onChange={setLanguage} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <p>Start chatting in {language} to begin your lesson!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 
                ${msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'}
              `}
            >
              <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type a message in ${language}...`}
            className="flex-1 bg-gray-800 text-gray-100 rounded-full px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
