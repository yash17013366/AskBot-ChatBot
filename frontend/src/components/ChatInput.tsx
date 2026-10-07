import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

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

  const canSend = input.trim() && !isLoading && !disabled;

  return (
    <div
      className={`relative flex items-end gap-2 rounded-2xl border p-2 transition-all duration-200 ${
        canSend || input
          ? 'border-violet-400 dark:border-violet-500 bg-white dark:bg-neutral-900 shadow-lg shadow-violet-100 dark:shadow-violet-950/40'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
      } focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:shadow-lg focus-within:shadow-violet-100 dark:focus-within:shadow-violet-950/50`}
    >
      <textarea
        ref={textareaRef}
        id="chat-message-input"
        rows={1}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message AskBot... (Shift+Enter for new line)"
        disabled={isLoading || disabled}
        className="w-full resize-none bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none max-h-44 disabled:opacity-50 leading-relaxed"
      />

      <button
        id="send-message-btn"
        onClick={onSend}
        disabled={!canSend}
        type="button"
        aria-label="Send message"
        className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shadow-sm shrink-0 active:scale-90"
      >
        <Send className="w-4 h-4" />
      </button>

      <span className="sr-only">Press Enter to send, Shift+Enter for new line</span>
    </div>
  );
};
