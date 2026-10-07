import React, { useRef, useEffect } from 'react';
import { Trash2, Sparkles, AlertCircle } from 'lucide-react';
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
    /*
      Outer wrapper: exactly fills the viewport below the header.
      No nested overflow — only the messages list scrolls.
    */
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 3.5rem)' }}>

      {/* ── Scrollable messages area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-2 sm:px-4 py-4">

          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-5 shadow-sm dark:shadow-violet-950/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Ready to chat
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-8 leading-relaxed">
                Ask anything — AskBot will respond in your chosen{' '}
                <span className="text-violet-600 dark:text-violet-400 font-medium">
                  {persona === 'student' ? 'Student' : persona === 'it_person' ? 'IT Person' : 'Explorer'}
                </span>{' '}
                persona tone.
              </p>

              {/* Quick starter prompts */}
              <div className="w-full max-w-sm flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 mb-1">
                  Try asking
                </span>
                {getPersonaHints().map((hint, idx) => (
                  <button
                    key={idx}
                    onClick={() => onInputChange(hint)}
                    className="text-left px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-150 active:scale-[0.99] shadow-sm"
                  >
                    "{hint}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="flex flex-col gap-1">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  isExpanding={expandingMessageId === m.id}
                  onTellMeMore={onTellMeMore}
                  disabled={isLoading || !!expandingMessageId}
                />
              ))}
            </div>
          )}

          {/* Loading indicator — typing dots */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 px-2 sm:px-4 py-3 animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-violet-500/20 dark:shadow-violet-900/30">
                <span className="w-3 h-3 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </span>
              </div>
              <div className="flex items-center gap-1.5 py-3">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Composer bar ── */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl transition-colors duration-200">
        {/* Error banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto px-4 pt-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-3">
          <ChatInput
            input={input}
            onInputChange={onInputChange}
            onSend={onSendMessage}
            isLoading={isLoading}
            disabled={!!expandingMessageId}
          />

          {/* Footer controls */}
          <div className="flex items-center justify-between mt-2 px-1">
            <button
              onClick={onClearChat}
              disabled={messages.length === 0 || isLoading || !!expandingMessageId}
              id="clear-chat-btn"
              type="button"
              className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs text-neutral-400 dark:text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear chat</span>
            </button>

            <span className="hidden sm:inline text-[11px] text-neutral-400 dark:text-neutral-600">
              Sends latest 5 exchanges to Gemini for context
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
