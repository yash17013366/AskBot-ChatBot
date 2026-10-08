import React, { useRef, useEffect } from 'react';
import { Trash2, AlertCircle, ArrowUpRight } from 'lucide-react';
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
    <div className="flex flex-col w-full" style={{ height: 'calc(100dvh - 3.5rem)' }}>

      {/* ── Scrollable messages area ── */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 py-6">

          {messages.length === 0 ? (
            /* Empty state — spacious and wide like ChatGPT */
            <div className="flex flex-col items-center justify-center min-h-[62vh] text-center px-4 animate-fade-in">
              <img
                src="/logo.png"
                alt="AskBot logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4 drop-shadow-md"
              />
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                Ready to chat
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-lg mb-10 leading-relaxed">
                Ask anything — AskBot will respond in your chosen{' '}
                <span className="text-[#38b6ff] font-semibold">
                  {persona === 'student' ? 'Student' : persona === 'it_person' ? 'IT Person' : 'Explorer'}
                </span>{' '}
                persona tone.
              </p>

              {/* Quick starter prompts — horizontal responsive 3-column grid spanning across the screen */}
              <div className="w-full max-w-4xl xl:max-w-5xl flex flex-col gap-3">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 text-left">
                  Try asking
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
                  {getPersonaHints().map((hint, idx) => (
                    <button
                      key={idx}
                      onClick={() => onInputChange(hint)}
                      className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#38b6ff] dark:hover:border-[#38b6ff] hover:bg-sky-50/40 dark:hover:bg-neutral-800/80 text-left transition-all duration-200 active:scale-[0.99] shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full mb-2.5">
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-[#38b6ff] tracking-wide uppercase">
                          Suggestion {idx + 1}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#38b6ff] transition-colors" />
                      </div>
                      <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white leading-relaxed">
                        "{hint}"
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="flex flex-col gap-2">
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

          {/* Loading indicator — typing dots with bot logo avatar */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 px-2 sm:px-4 py-3 animate-fade-in">
              <img
                src="/logo.png"
                alt="AskBot typing"
                className="w-7 h-7 rounded-full object-contain shrink-0 mt-0.5 drop-shadow-sm"
              />
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

      {/* ── Composer bar — edge-to-edge container with matching wide inner layout ── */}
      <div className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl transition-colors duration-200">
        {/* Error banner */}
        {errorMessage && (
          <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 pt-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
          <ChatInput
            input={input}
            onInputChange={onInputChange}
            onSend={onSendMessage}
            isLoading={isLoading}
            disabled={!!expandingMessageId}
          />

          {/* Footer controls */}
          <div className="flex items-center justify-between mt-2.5 px-1">
            <button
              onClick={onClearChat}
              disabled={messages.length === 0 || isLoading || !!expandingMessageId}
              id="clear-chat-btn"
              type="button"
              className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs text-neutral-400 dark:text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear chat</span>
            </button>

            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">
              Sends latest 5 exchanges to Gemini for context
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
