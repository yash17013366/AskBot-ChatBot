import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ConnectionState } from '../types/chat';

interface ConnectionStatusProps {
  status: ConnectionState;
  message?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, message }) => {
  if (status === 'disconnected') return null;

  if (status === 'connecting') {
    return (
      <div
        id="connection-status-connecting"
        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-sm animate-pulse"
      >
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        <span>Verifying API key with Google Gemini...</span>
      </div>
    );
  }

  if (status === 'connected') {
    return (
      <div
        id="connection-status-success"
        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>✓ LLM Connected</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        id="connection-status-error"
        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm"
      >
        <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <span>✕ {message || 'Invalid Gemini API key. Please check your key and try again.'}</span>
      </div>
    );
  }

  return null;
};
