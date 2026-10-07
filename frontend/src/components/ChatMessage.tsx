import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessageItem } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageItem;
  isExpanding?: boolean;
  onTellMeMore?: (message: ChatMessageItem) => void;
  disabled?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isExpanding = false,
  onTellMeMore,
  disabled = false,
}) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-2 sm:px-4 py-1.5 animate-fade-in">
        <div className="flex items-end gap-2.5 max-w-[80%] sm:max-w-[72%]">
          <div className="bg-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 mb-0.5">
            <User className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-300" />
          </div>
        </div>
      </div>
    );
  }

  // AI message — no bubble, full-width, ChatGPT style
  return (
    <div className="flex gap-3 sm:gap-4 px-2 sm:px-4 py-3 animate-fade-in">
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-violet-500/20 dark:shadow-violet-900/30">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Markdown content */}
        <div className="askbot-prose">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Tell Me More */}
        {onTellMeMore && (
          <div className="mt-3">
            <button
              onClick={() => onTellMeMore(message)}
              disabled={disabled || isExpanding}
              id={`tell-me-more-btn-${message.id}`}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800/50 hover:border-violet-300 dark:hover:border-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
            >
              {isExpanding ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Expanding explanation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Tell me more</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
