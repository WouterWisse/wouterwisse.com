'use client';

import { OfficeScene } from './OfficeScene';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useKeyboardSounds } from '@/hooks/useKeyboardSounds';
import { useRef } from 'react';
import { FiSmartphone, FiVolume2, FiVolumeX } from 'react-icons/fi';

export function Hero() {
  const { isDark, toggleMode } = useThemeMode();
  const sound = useKeyboardSounds();
  const interacted = useRef(false);
  const unlockSound = (event: React.SyntheticEvent) => {
    if (interacted.current || (event.target as HTMLElement).closest('[data-sound-toggle]')) return;
    interacted.current = true;
    void sound.enable();
  };
  return (
    <section className="office-home" data-mode={isDark ? 'night' : 'day'} onPointerDownCapture={unlockSound} onKeyDownCapture={unlockSound}>
      <button
        type="button"
        className="office-sound-toggle"
        data-sound-toggle
        aria-label={sound.unavailable ? 'Office sounds unavailable' : sound.enabled ? 'Mute sounds' : 'Enable sounds'}
        aria-pressed={sound.enabled}
        disabled={sound.unavailable}
        title={sound.enabled ? 'Mute sounds' : 'Enable sounds'}
        onClick={() => { interacted.current = true; void sound.toggle(); }}
      >
        {sound.enabled ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
      </button>
      <h1 className="sr-only">Wouter Wisse, full stack developer</h1>
      <OfficeScene isDark={isDark} onToggleLamp={toggleMode} onType={sound.tap} onPause={sound.silence} onSound={sound.playEffect} onStopSounds={sound.stopEffects} musicPlaying={sound.musicPlaying} onToggleMusic={sound.toggleMusic} getMusicTime={sound.getMusicTime} />
      <p className="office-rotate-hint" aria-hidden="true"><FiSmartphone />Rotate for the full office</p>
    </section>
  );
}
