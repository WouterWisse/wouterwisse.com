'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Mode } from '@/types/theme';
import { isDaytime } from './useSunPosition';

const STORAGE_KEY = 'theme-mode';

function getSystemPreference(): Mode | null {
  if (typeof window === 'undefined') return null;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}

export function useThemeMode() {
  const [mode, setModeState] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  // Load saved preference on mount, fallback to system preference, then sun position
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === 'light' || saved === 'dark') {
      setModeState(saved);
    } else {
      // Check system preference first, then fall back to sun position
      const systemPref = getSystemPreference();
      if (systemPref) {
        setModeState(systemPref);
      } else {
        const daytime = isDaytime();
        setModeState(daytime ? 'light' : 'dark');
      }
    }
  }, []);

  // Listen for system preference changes (only when no saved preference)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return; // User has explicit preference, don't override

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setModeState(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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
