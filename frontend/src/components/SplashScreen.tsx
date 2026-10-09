import React from 'react';

interface SplashScreenProps {
  isFading: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isFading }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-opacity duration-250 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle CRT scanline overlay */}
      <div className="pointer-events-none absolute inset-0 crt-scanlines" />

      {/* Main retro-futuristic terminal splash container */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Wordmark with typewriter effect and blinking cursor */}
        <div className="flex items-center justify-center leading-none">
          <span className="font-poppins font-extrabold text-4xl sm:text-5xl tracking-tight animate-typewriter">
            <span className="text-neutral-900 dark:text-white">Ask</span>
            <span className="text-[#38b6ff]">Bot</span>
          </span>
          <span
            className="inline-block w-2.5 sm:w-3 h-8 sm:h-10 bg-[#38b6ff] shadow-[0_0_10px_#38b6ff] animate-cursor-blink ml-1.5 align-middle"
            aria-hidden="true"
          />
        </div>

        {/* Small monospace status line */}
        <p className="font-mono text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-4 tracking-wider">
          <span className="text-[#38b6ff] mr-1.5">&gt;</span>Booting AskBot...
        </p>

        {/* Thin glowing progress bar filling over 1s */}
        <div className="w-48 sm:w-60 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-5 shadow-inner">
          <div className="h-full bg-[#38b6ff] rounded-full shadow-[0_0_12px_#38b6ff] animate-progress-fill" />
        </div>
      </div>
    </div>
  );
};
