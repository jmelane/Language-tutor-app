import React from 'react';
import { UserStats } from '../types';
import { Trophy, Star, Award, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  stats: UserStats;
}

export const GamificationPanel: React.FC<Props> = ({ stats }) => {
  
  const getIcon = (name: string): LucideIcon => {
      return (Icons as any)[name] || Award;
  };

  return (
    <div className="space-y-6">
      {/* Level & Points */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 rounded-xl border border-blue-800/30">
        <div className="flex justify-between items-start mb-4">
            <div>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Current Level</span>
                <h2 className="text-2xl font-bold text-white">{stats.level}</h2>
            </div>
            <div className="text-right">
                 <div className="flex items-center justify-end gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-xl">{stats.points}</span>
                 </div>
                 <span className="text-xs text-gray-400">Total Points</span>
            </div>
        </div>
        
        {/* Progress Bar Mock */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(stats.points % 1000) / 10}%` }} 
            />
        </div>
        <p className="text-xs text-gray-400 text-right">Next level in {1000 - (stats.points % 1000)} points</p>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
        </h3>
        <div className="grid grid-cols-3 gap-2">
            {stats.badges.map(badge => {
                const Icon = getIcon(badge.icon);
                return (
                    <div key={badge.id} className="flex flex-col items-center p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors group relative">
                        <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-[10px] text-center text-gray-300 font-medium leading-tight">{badge.name}</span>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-black text-xs text-white p-2 rounded z-50 text-center">
                            {badge.description}
                        </div>
                    </div>
                );
            })}
            {/* Empty slots for visual balance */}
            {[1,2].map(i => (
                <div key={`empty-${i}`} className="flex flex-col items-center p-2 bg-gray-800/30 rounded-lg border border-gray-800 border-dashed">
                     <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-2 opacity-50">
                        <Award className="w-5 h-5 text-gray-600" />
                     </div>
                     <span className="text-[10px] text-gray-600">Locked</span>
                </div>
            ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">Streak</span>
            </div>
            <span className="text-xl font-bold text-white">{stats.streak} Days</span>
        </div>
         <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold">Lessons</span>
            </div>
            <span className="text-xl font-bold text-white">{stats.lessonsCompleted}</span>
        </div>
      </div>
    </div>
  );
};
