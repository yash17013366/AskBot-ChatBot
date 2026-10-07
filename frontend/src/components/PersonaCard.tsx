import React from 'react';
import { GraduationCap, Terminal, Compass } from 'lucide-react';
import { PersonaId } from '../types/chat';

interface PersonaCardProps {
  id: PersonaId;
  title: string;
  tagline: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: PersonaId) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  id,
  title,
  tagline,
  description,
  isSelected,
  onSelect,
}) => {
  const getIcon = () => {
    switch (id) {
      case 'student':
        return <GraduationCap className="w-6 h-6 text-emerald-500" />;
      case 'it_person':
        return <Terminal className="w-6 h-6 text-blue-500" />;
      case 'explorer':
        return <Compass className="w-6 h-6 text-purple-500" />;
    }
  };

  return (
    <div
      id={`persona-card-${id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
          {getIcon()}
        </div>
        <span
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
      </div>

      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
        {tagline}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
