import React from 'react';
import { PersonaCard } from './PersonaCard';
import { PersonaId } from '../types/chat';
import { Bot, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  selectedPersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedPersona,
  onSelectPersona,
  onContinue,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center text-center">
      {/* AskBot Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
        <Bot className="w-4 h-4" />
        Powered by Google Gemini
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
        AskBot
      </h1>

      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-10">
        Your simple, personalized AI assistant.
      </p>

      {/* Personas Section */}
      <div className="w-full mb-10">
        <div className="text-left mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
            Step 1: Choose Your Persona
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select how you would like AskBot to tailor its answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PersonaCard
            id="student"
            title="Student"
            tagline="Friendly & Easy to Learn"
            description="Friendly explanations with a little humor. Uses simple analogies and avoids unnecessary jargon."
            isSelected={selectedPersona === 'student'}
            onSelect={onSelectPersona}
          />

          <PersonaCard
            id="it_person"
            title="IT Person"
            tagline="Precise & Technical"
            description="Precise, technical, and to the point. Focuses on code, architecture, and practical details without fluff."
            isSelected={selectedPersona === 'it_person'}
            onSelect={onSelectPersona}
          />

          <PersonaCard
            id="explorer"
            title="Explorer"
            tagline="Balanced & Inquisitive"
            description="Balanced answers for curious minds. Blends friendly clarity with insightful context and broad perspective."
            isSelected={selectedPersona === 'explorer'}
            onSelect={onSelectPersona}
          />
        </div>
      </div>

      {/* Continue CTA */}
      <button
        id="continue-to-key-btn"
        onClick={onContinue}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-sm hover:shadow transition-all duration-150 active:scale-95"
      >
        <span>Continue to API Key</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
