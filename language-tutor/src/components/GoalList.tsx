import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Plus, Check, X } from 'lucide-react';

interface Props {
  goals: Goal[];
  toggleGoal: (id: string) => void;
  addGoal: (text: string) => void;
}

export const GoalList: React.FC<Props> = ({ goals, toggleGoal, addGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const handleAdd = () => {
    if (newGoalText.trim()) {
      addGoal(newGoalText);
      setNewGoalText('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4" />
          Daily Goals
        </h3>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-gray-400 hover:text-blue-400 transition-colors"
        >
            <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {goals.map(goal => (
          <div 
            key={goal.id}
            className={`
                group flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer
                ${goal.completed 
                    ? 'bg-green-900/10 border-green-800/50' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'}
            `}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className={`
                w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-blue-500'}
            `}>
                {goal.completed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                {goal.text}
            </span>
          </div>
        ))}

        {isAdding && (
            <div className="flex items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-lg">
                <input 
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="New goal..."
                    className="bg-transparent text-sm text-white focus:outline-none flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="text-green-400 hover:text-green-300">
                    <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setIsAdding(false)} className="text-red-400 hover:text-red-300">
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
