import React from 'react';
import { GraduationCap, Terminal, Compass, Check } from 'lucide-react';
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
  const getIconConfig = () => {
    switch (id) {
      case 'student':
        return {
          icon: <GraduationCap className="w-5 h-5" />,
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
          accentText: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'it_person':
        return {
          icon: <Terminal className="w-5 h-5" />,
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
          accentText: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'explorer':
        return {
          icon: <Compass className="w-5 h-5" />,
          iconBg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-[#38b6ff]',
          accentText: 'text-sky-600 dark:text-[#38b6ff]',
        };
    }
  };

  const { icon, iconBg, accentText } = getIconConfig();

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
      className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer select-none transition-all duration-200 text-left ${
        isSelected
          ? 'border-[#38b6ff] dark:border-[#38b6ff] bg-sky-50/70 dark:bg-sky-950/40 shadow-lg shadow-[#38b6ff]/15 dark:shadow-[#38b6ff]/10'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm'
      }`}
    >
      {/* Selection indicator */}
      <div
        className={`absolute top-3.5 right-3.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'border-[#38b6ff] bg-[#38b6ff]'
            : 'border-neutral-300 dark:border-neutral-700'
        }`}
      >
        {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>

      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>

      <h3 className="font-semibold text-neutral-900 dark:text-white text-base mb-0.5">{title}</h3>
      <p className={`text-xs font-medium mb-2 ${accentText}`}>{tagline}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
};
