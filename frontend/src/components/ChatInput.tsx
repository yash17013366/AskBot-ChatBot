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
        200
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
      className={`relative flex items-end gap-3 rounded-2xl border p-2 sm:p-2.5 transition-all duration-200 ${
        canSend || input
          ? 'border-[#38b6ff] dark:border-[#38b6ff] bg-white dark:bg-neutral-900 shadow-lg shadow-[#38b6ff]/15 dark:shadow-[#38b6ff]/10'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
      } focus-within:border-[#38b6ff] dark:focus-within:border-[#38b6ff] focus-within:shadow-lg focus-within:shadow-[#38b6ff]/20 dark:focus-within:shadow-[#38b6ff]/15`}
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
        className="w-full resize-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none max-h-48 disabled:opacity-50 leading-relaxed"
      />

      <button
        id="send-message-btn"
        onClick={onSend}
        disabled={!canSend}
        type="button"
        aria-label="Send message"
        className="p-2.5 rounded-xl bg-[#38b6ff] hover:bg-[#20a8f7] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shadow-sm shrink-0 active:scale-90 cursor-pointer mb-0.5"
      >
        <Send className="w-4 h-4" />
      </button>

      <span className="sr-only">Press Enter to send, Shift+Enter for new line</span>
    </div>
  );
};
