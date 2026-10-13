'use client';

import { useSyncExternalStore, useCallback } from 'react';
import type { Mode } from '@/types/theme';

const STORAGE_KEY = 'theme-mode';
const CHANGE_EVENT = 'theme-mode-change';
let memoryPreference: Mode | null = null;

function getPreference(): Mode {
  if (memoryPreference) return memoryPreference;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Storage may be disabled. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) { memoryPreference = null; onChange(); }
  };
  media.addEventListener('change', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getPreference, () => 'light' as Mode);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const setMode = useCallback((newMode: Mode) => {
    memoryPreference = newMode;
    try { localStorage.setItem(STORAGE_KEY, newMode); } catch { /* Keep the in-memory preference. */ }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  const toggleMode = useCallback(() => {
    setMode(getPreference() === 'light' ? 'dark' : 'light');
  }, [setMode]);

  return { mode, setMode, toggleMode, mounted, isDark: mode === 'dark', isLight: mode === 'light' };
}
