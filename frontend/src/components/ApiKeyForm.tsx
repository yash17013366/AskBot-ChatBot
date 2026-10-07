import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, ExternalLink, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { ConnectionState, PersonaId } from '../types/chat';

interface ApiKeyFormProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onConnect: () => void;
  onBack: () => void;
  connectionStatus: ConnectionState;
  errorMessage?: string;
  selectedPersona: PersonaId;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKey,
  onApiKeyChange,
  onConnect,
  onBack,
  connectionStatus,
  errorMessage,
  selectedPersona,
}) => {
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onConnect();
    }
  };

  const personaLabel =
    selectedPersona === 'student'
      ? 'Student'
      : selectedPersona === 'it_person'
      ? 'IT Person'
      : 'Explorer';

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-8 transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Personas
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
              Persona:{' '}
              <strong className="text-violet-600 dark:text-violet-400 font-semibold">{personaLabel}</strong>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Connect Gemini API Key
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            Enter your personal Google Gemini API key. AskBot verifies it with a live ping before opening the chat.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="gemini-api-key"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="gemini-api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIzaSy..."
                  autoComplete="off"
                  disabled={connectionStatus === 'connecting'}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-500 text-sm pr-11 font-mono transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  id="toggle-show-key-btn"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 p-1 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Verification feedback */}
            <ConnectionStatus status={connectionStatus} message={errorMessage} />

            {/* Connect button */}
            <button
              type="submit"
              id="connect-api-key-btn"
              disabled={!apiKey.trim() || connectionStatus === 'connecting'}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 dark:shadow-violet-900/30 active:scale-[0.99]"
            >
              {connectionStatus === 'connecting' ? 'Connecting & Verifying...' : 'Connect to AskBot'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              id="get-free-key-link"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
            >
              <span>Get a free Gemini API key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Stored in temporary browser session only. Never saved in any database.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
