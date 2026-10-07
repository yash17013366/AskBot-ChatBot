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

    let icon = <GraduationCap className="w-3 h-3" />;
    let label = 'Student';
    let colorClasses = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';

    if (persona === 'it_person') {
      icon = <Terminal className="w-3 h-3" />;
      label = 'IT Person';
      colorClasses = 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
    } else if (persona === 'explorer') {
      icon = <Compass className="w-3 h-3" />;
      label = 'Explorer';
      colorClasses = 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60';
    }

    return (
      <div
        id="active-persona-badge"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${colorClasses}`}
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-900/30">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-neutral-900 dark:text-white tracking-tight">
            AskBot
          </span>
          {persona && isConnected && (
            <div className="hidden sm:block">
              {getPersonaBadge()}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/50 transition-all duration-150"
              title="Disconnect Gemini API Key"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
