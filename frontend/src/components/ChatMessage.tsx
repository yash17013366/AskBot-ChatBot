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

  return (
    <div
      className={`flex gap-3 sm:gap-4 py-4 px-2 sm:px-4 ${
        isUser
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-bl-none shadow-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:my-2 [&>pre]:overflow-x-auto [&>code]:bg-gray-100 dark:[&>code]:bg-gray-700 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Tell Me More CTA on every assistant message */}
        {!isUser && onTellMeMore && (
          <div className="mt-2">
            <button
              onClick={() => onTellMeMore(message)}
              disabled={disabled || isExpanding}
              id={`tell-me-more-btn-${message.id}`}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
            >
              {isExpanding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>Expanding explanation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Tell me more</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
