import React from 'react';
import { FeedbackPanel } from './FeedbackPanel';
import { GoalList } from './GoalList';
import { GamificationPanel } from './GamificationPanel';
import { useTutor } from '../hooks/useTutor';
import { X } from 'lucide-react';

type TutorState = ReturnType<typeof useTutor>;

interface Props extends TutorState {
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
  messages, 
  stats, 
  goals, 
  toggleGoal, 
  addGoal,
  onCloseMobile 
}) => {
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
  const lastAssistantMessage = lastMessage?.role === 'assistant' ? lastMessage : messages[messages.length - 2];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-100">Learning Hub</h2>
        <button onClick={onCloseMobile} className="md:hidden text-gray-400">
            <X />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Gamification Section */}
        <section>
             <GamificationPanel stats={stats} />
        </section>

        <div className="w-full h-px bg-gray-700/50" />

        {/* Goals Section */}
        <section>
            <GoalList goals={goals} toggleGoal={toggleGoal} addGoal={addGoal} />
        </section>

        <div className="w-full h-px bg-gray-700/50" />

        {/* Feedback Section */}
        <section className="pb-4">
            <FeedbackPanel lastMessage={lastAssistantMessage} />
        </section>
      </div>
    </div>
  );
};
