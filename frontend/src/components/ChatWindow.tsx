import React, { useRef, useEffect } from 'react';
import { Trash2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatMessageItem, PersonaId } from '../types/chat';

interface ChatWindowProps {
  messages: ChatMessageItem[];
  input: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  onTellMeMore: (message: ChatMessageItem) => void;
  onClearChat: () => void;
  isLoading: boolean;
  expandingMessageId: string | null;
  errorMessage: string | null;
  persona: PersonaId;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  input,
  onInputChange,
  onSendMessage,
  onTellMeMore,
  onClearChat,
  isLoading,
  expandingMessageId,
  errorMessage,
  persona,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or loading starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, expandingMessageId]);

  const getPersonaHints = () => {
    switch (persona) {
      case 'student':
        return [
          'Explain how neural networks learn like I am five.',
          'What is the difference between supervised and unsupervised learning?',
          'Help me understand big-O notation with simple examples.',
        ];
      case 'it_person':
        return [
          'What are the key trade-offs between REST and gRPC in microservices?',
          'How does connection pooling improve PostgreSQL throughput?',
          'Explain Docker container networking modes and DNS resolution.',
        ];
      case 'explorer':
        return [
          'How will quantum computing transform cryptography?',
          'Why did the universe expand so quickly during cosmic inflation?',
          'What are emergent abilities in large language models?',
        ];
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to chat!
            </h3>
            <p className="text-sm max-w-md mb-8">
              Ask anything. AskBot will respond in your chosen{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {persona === 'student' ? 'Student' : persona === 'it_person' ? 'IT Person' : 'Explorer'}
              </strong>{' '}
              persona tone.
            </p>

            {/* Quick Starter Prompts */}
            <div className="w-full max-w-md flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                Try asking:
              </span>
              {getPersonaHints().map((hint, idx) => (
                <button
                  key={idx}
                  onClick={() => onInputChange(hint)}
                  className="text-left p-3 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
                >
                  "{hint}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              isExpanding={expandingMessageId === m.id}
              onTellMeMore={onTellMeMore}
              disabled={isLoading || !!expandingMessageId}
            />
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span className="animate-pulse">AskBot is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert if chat request failed */}
      {errorMessage && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Input & Footer Controls */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
        <ChatInput
          input={input}
          onInputChange={onInputChange}
          onSend={onSendMessage}
          isLoading={isLoading}
          disabled={!!expandingMessageId}
        />

        <div className="flex items-center justify-between mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={onClearChat}
            disabled={messages.length === 0 || isLoading || !!expandingMessageId}
            id="clear-chat-btn"
            type="button"
            className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>

          <span className="hidden sm:inline text-[11px] text-gray-400 dark:text-gray-500">
            Sends latest 5 exchanges to Gemini for context
          </span>
        </div>
      </div>
    </div>
  );
};
