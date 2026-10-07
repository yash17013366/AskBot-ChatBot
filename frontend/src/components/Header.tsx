import React from 'react';
import { Bot, LogOut, GraduationCap, Terminal, Compass } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PersonaId } from '../types/chat';

interface HeaderProps {
  persona: PersonaId | null;
  isConnected: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  persona,
  isConnected,
  theme,
  onToggleTheme,
  onDisconnect,
}) => {
  const getPersonaBadge = () => {
    if (!persona) return null;

    let icon = <GraduationCap className="w-3.5 h-3.5" />;
    let label = 'Student';
    let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';

    if (persona === 'it_person') {
      icon = <Terminal className="w-3.5 h-3.5" />;
      label = 'IT Person';
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    } else if (persona === 'explorer') {
      icon = <Compass className="w-3.5 h-3.5" />;
      label = 'Explorer';
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
    }

    return (
      <div
        id="active-persona-badge"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
              AskBot
            </span>
          </div>
          {persona && isConnected && (
            <div className="hidden sm:block ml-2">
              {getPersonaBadge()}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {persona && isConnected && (
            <div className="sm:hidden">
              {getPersonaBadge()}
            </div>
          )}

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {isConnected && (
            <button
              onClick={onDisconnect}
              id="disconnect-btn"
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors"
              title="Disconnect Gemini API Key"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
