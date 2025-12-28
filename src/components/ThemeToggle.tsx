'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import type { Mode } from '@/types/theme';

interface ThemeToggleProps {
  mode: Mode;
  onToggle: () => void;
  color?: string;
}

export function ThemeToggle({ mode, onToggle, color }: ThemeToggleProps) {
  const isDark = mode === 'dark';
  const iconColor = color || (isDark ? '#fbbf24' : '#94a3b8');

  return (
    <button
      onClick={onToggle}
      className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-500 hover:scale-110"
      style={{
        backgroundColor: isDark ? '#2a2040' : '#f0f0f0',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Show sun in dark mode (to switch to light) */}
      <FiSun
        className="absolute h-4 w-4 md:h-5 md:w-5 transition-all duration-500"
        style={{
          color: iconColor,
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)',
        }}
      />
      {/* Show moon in light mode (to switch to dark) */}
      <FiMoon
        className="absolute h-4 w-4 md:h-5 md:w-5 transition-all duration-500"
        style={{
          color: iconColor,
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0)' : 'rotate(0) scale(1)',
        }}
      />
    </button>
  );
}
