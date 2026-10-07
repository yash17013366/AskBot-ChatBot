import React from 'react';
import { PersonaCard } from './PersonaCard';
import { PersonaId } from '../types/chat';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-12 sm:py-16 animate-fade-in">
      <div className="w-full max-w-2xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini
          </span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-neutral-900 dark:text-white">Ask</span>
            <span className="gradient-text">Bot</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Your personalized AI assistant. Choose how you want it to respond.
          </p>
        </div>

        {/* Persona selection */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 text-center mb-5">
            Step 1 — Choose your persona
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PersonaCard
              id="student"
              title="Student"
              tagline="Friendly & Easy to Learn"
              description="Simple analogies, friendly tone, no jargon. Perfect for learning concepts from scratch."
              isSelected={selectedPersona === 'student'}
              onSelect={onSelectPersona}
            />

            <PersonaCard
              id="it_person"
              title="IT Person"
              tagline="Precise & Technical"
              description="Straight to the point. Code, architecture, and trade-offs — no hand-holding."
              isSelected={selectedPersona === 'it_person'}
              onSelect={onSelectPersona}
            />

            <PersonaCard
              id="explorer"
              title="Explorer"
              tagline="Balanced & Inquisitive"
              description="Big-picture curiosity. Broad context, insightful perspectives, and thought-provoking depth."
              isSelected={selectedPersona === 'explorer'}
              onSelect={onSelectPersona}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            id="continue-to-key-btn"
            onClick={onContinue}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 dark:shadow-violet-900/40 hover:shadow-violet-500/30 dark:hover:shadow-violet-900/60 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Continue to API Key</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
