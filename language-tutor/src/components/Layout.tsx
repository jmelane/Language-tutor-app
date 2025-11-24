import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { useTutor } from '../hooks/useTutor';
import { Menu } from 'lucide-react';

export const Layout = () => {
  const tutorState = useTutor();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-gray-800 p-4 z-50 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">LinguaTutor</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
        w-80 bg-gray-800 border-r border-gray-700 z-40 overflow-y-auto
      `}>
        <Sidebar {...tutorState} onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full h-full pt-16 md:pt-0">
        <ChatArea {...tutorState} />
      </div>
    </div>
  );
};
