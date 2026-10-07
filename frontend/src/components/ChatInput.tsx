import React, { useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  isLoading,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent p-2 transition-all">
      <textarea
        ref={textareaRef}
        id="chat-message-input"
        rows={1}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Shift + Enter for new line)"
        disabled={isLoading || disabled}
        className="w-full resize-none bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none max-h-44 disabled:opacity-50"
      />

      <button
        id="send-message-btn"
        onClick={onSend}
        disabled={!input.trim() || isLoading || disabled}
        type="button"
        aria-label="Send message"
        className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0 active:scale-95"
      >
        <Send className="w-4 h-4" />
      </button>

      <span className="sr-only">Press Enter to send, Shift+Enter for new line</span>
    </div>
  );
};
