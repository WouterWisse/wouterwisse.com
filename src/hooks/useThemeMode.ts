'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Mode } from '@/types/theme';

const STORAGE_KEY = 'theme-mode';

export function useThemeMode() {
  const [mode, setModeState] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'light' || saved === 'dark') {
      setModeState(saved);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  return {
    mode,
    setMode,
    toggleMode,
    mounted,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
}
