'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        // Sun icon for dark mode (to switch to light)
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.323 2.677a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zm2.646 2.646a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707zM16 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm1.323 3.677a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zm-2.646 2.646a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707zM10 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.323-2.677a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zm-2.646-2.646a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707zM4 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-1.323-3.677a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for light mode (to switch to dark)
        <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
