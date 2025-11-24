import React from 'react';
import { Language } from '../types';
import { ChevronDown } from 'lucide-react';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES: Language[] = ['Spanish', 'French', 'German', 'Japanese', 'Italian'];

export const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="relative group">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as Language)}
        className="appearance-none bg-gray-700 text-white pl-4 pr-10 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
      >
        {LANGUAGES.map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};
