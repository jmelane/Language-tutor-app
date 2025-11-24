import React from 'react';
import { Message } from '../types';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  lastMessage?: Message;
}

export const FeedbackPanel: React.FC<Props> = ({ lastMessage }) => {
  if (!lastMessage || !lastMessage.feedback) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Feedback will appear here as you chat</p>
      </div>
    );
  }

  const { feedback } = lastMessage;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Real-time Feedback</h3>
      
      {feedback.positivePoints.length > 0 && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Great Job!</span>
          </div>
          <ul className="text-sm text-green-300 space-y-1 list-disc list-inside">
            {feedback.positivePoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.corrections.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
           <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Corrections</span>
          </div>
          <div className="space-y-3">
            {feedback.corrections.map((correction, i) => (
              <div key={i} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-red-300 line-through text-xs">{correction.original}</span>
                   <span className="text-gray-500">→</span>
                   <span className="text-green-400 font-medium">{correction.corrected}</span>
                </div>
                <p className="text-gray-400 text-xs italic">{correction.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {feedback.suggestions.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">Tips</span>
          </div>
          <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
            {feedback.suggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
