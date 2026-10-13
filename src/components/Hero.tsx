'use client';

import { OfficeScene } from './OfficeScene';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useKeyboardSounds } from '@/hooks/useKeyboardSounds';
import { useEffect } from 'react';
import { FiSmartphone, FiVolume2, FiVolumeX } from 'react-icons/fi';

export function Hero() {
  const { isDark, toggleMode } = useThemeMode();
  const sound = useKeyboardSounds();
  // Tint the browser chrome (e.g. Android Chrome's address bar) to the current wall colour.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]') ?? document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));
    meta.setAttribute('content', isDark ? '#181b25' : '#faf8f5');
  }, [isDark]);
  // Sound only starts on an explicit request (the speaker button or the Sonos), since it takes over
  // the iOS audio session and pauses the visitor's own media.
  const toggleMusic = () => {
    if (!sound.musicPlaying) void sound.enable();
    sound.toggleMusic();
  };
  return (
    <section className="office-home" data-mode={isDark ? 'night' : 'day'}>
      <button
        type="button"
        className="office-sound-toggle"
        aria-label={sound.unavailable ? 'Office sounds unavailable' : sound.enabled ? 'Mute sounds' : 'Enable sounds'}
        aria-pressed={sound.enabled}
        disabled={sound.unavailable}
        title={sound.enabled ? 'Mute sounds' : 'Enable sounds'}
        onClick={() => void sound.toggle()}
      >
        {sound.enabled ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
      </button>
      <h1 className="sr-only">Wouter Wisse, full stack developer</h1>
      <OfficeScene isDark={isDark} onToggleLamp={toggleMode} onType={sound.tap} onPause={sound.silence} onSound={sound.playEffect} onStopSounds={sound.stopEffects} musicPlaying={sound.musicPlaying} onToggleMusic={toggleMusic} getMusicTime={sound.getMusicTime} />
      <p className="office-rotate-hint" aria-hidden="true"><FiSmartphone />Rotate for the full office</p>
    </section>
  );
}
