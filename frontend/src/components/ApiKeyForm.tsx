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
    <div className="max-w-lg mx-auto px-4 py-10 w-full">
      <button
        onClick={onBack}
        type="button"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Personas
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            Persona: <strong className="text-indigo-600 dark:text-indigo-400">{personaLabel}</strong>
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connect Gemini API Key
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your personal Google Gemini API key. AskBot tests your key with a live ping before opening the chat.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="gemini-api-key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-12 font-mono transition-all"
              />
              <button
                type="button"
                id="toggle-show-key-btn"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
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
            className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.99]"
          >
            {connectionStatus === 'connecting' ? 'Connecting & Verifying...' : 'Connect to AskBot'}
          </button>
        </form>

        {/* Free API Key link & Security Note */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800/80 flex flex-col gap-3">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            id="get-free-key-link"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            <span>Get a free Gemini API key from Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Stored in temporary browser session only. Never saved in any database.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
