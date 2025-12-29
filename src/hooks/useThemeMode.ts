'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Mode } from '@/types/theme';
import { isDaytime } from './useSunPosition';

const STORAGE_KEY = 'theme-mode';

export function useThemeMode() {
  const [mode, setModeState] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount, fallback to sun position
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'light' || saved === 'dark') {
      setModeState(saved);
    } else {
      // Default based on sunrise/sunset (light during day, dark at night)
      const daytime = isDaytime();
      setModeState(daytime ? 'light' : 'dark');
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
