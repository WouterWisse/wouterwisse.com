'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type OfficeSound = 'notification' | 'growl' | 'slurp' | 'fan' | 'success' | 'lamp' | 'sticker-peel' | 'sticker-loose';

// iOS silences Web Audio under the ring/silent switch unless the page's audio session is 'playback'
// (Safari 16.4+); only the Sonos' <audio> element switched it before. 'auto' hands it back when muted.
function setAudioSession(type: 'playback' | 'auto') {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session) session.type = type;
}

export function useKeyboardSounds() {
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const buffers = useRef<AudioBuffer[]>([]);
  const active = useRef(false);
  const lastSample = useRef(-1);
  const playing = useRef(new Set<AudioBufferSourceNode>());
  const loading = useRef<Promise<AudioBuffer[]> | null>(null);
  const effects = useRef<Partial<Record<OfficeSound, AudioBuffer>>>({});
  const effectLoading = useRef<Promise<void> | null>(null);
  const effectSources = useRef(new Set<AudioBufferSourceNode>());
  const effectEpoch = useRef(0);
  const music = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const getMusicTime = useCallback(() => music.current?.currentTime ?? 0, []);

  // Streaming music has its own transport; reaction cleanup only stops one-shot effects.
  const toggleMusic = useCallback(() => {
    if (!music.current) {
      const track = new Audio('/sounds/deep-house.mp3');
      track.loop = true;
      track.preload = 'none';
      track.volume = .3;
      track.onplaying = () => setMusicPlaying(true);
      track.onpause = () => setMusicPlaying(!track.paused);
      track.onerror = () => { track.pause(); setMusicPlaying(false); };
      music.current = track;
    }
    const track = music.current;
    track.muted = !active.current;
    if (!track.paused) {
      track.pause();
    } else {
      void track.play().catch(() => {
        if (track.paused) setMusicPlaying(false);
      });
    }
  }, []);

  const stopEffects = useCallback(() => {
    effectEpoch.current++;
    effectSources.current.forEach(source => { try { source.stop(); } catch { /* Already ended. */ } });
    effectSources.current.clear();
  }, []);

  const silence = useCallback(() => {
    playing.current.forEach(source => { try { source.stop(); } catch { /* Already ended. */ } });
    playing.current.clear();
  }, []);

  const enable = useCallback(async () => {
    if (active.current) return;
    active.current = true;
    setEnabled(true);
    setAudioSession('playback');
    if (music.current) music.current.muted = false;
    try {
      const audio = context.current ?? new AudioContext({ latencyHint: 'interactive' });
      context.current = audio;
      effectLoading.current ??= Promise.allSettled((['notification', 'growl', 'slurp', 'fan', 'success', 'lamp', 'sticker-peel', 'sticker-loose'] as const).map(async name => {
        const response = await fetch(name === 'notification' ? '/sounds/iphone-ping.mp3' : `/sounds/office-${name}.mp3${name === 'fan' ? '?v=2' : ''}`);
        if (!response.ok) return;
        effects.current[name] = await audio.decodeAudioData(await response.arrayBuffer());
      })).then(() => undefined);
      await audio.resume();
      if (!buffers.current.length) {
        loading.current ??= Promise.allSettled(Array.from({ length: 18 }, async (_, index) => {
          const response = await fetch(`/sounds/keyboard-tap-${String(index + 1).padStart(2, '0')}.mp3`);
          if (!response.ok) throw new Error('Keyboard sound unavailable');
          return audio.decodeAudioData(await response.arrayBuffer());
        })).then(loaded => loaded.flatMap(result => result.status === 'fulfilled' ? [result.value] : []));
        buffers.current = await loading.current;
        if (!buffers.current.length) throw new Error('Keyboard sounds unavailable');
      }
    } catch {
      active.current = false;
      setEnabled(false);
      setUnavailable(true);
      setAudioSession('auto');
      if (music.current) music.current.muted = true;
    }
  }, []);

  const toggle = useCallback(() => {
    if (!active.current) return enable();
    active.current = false;
    setEnabled(false);
    setAudioSession('auto');
    if (music.current) music.current.muted = true;
    silence();
    stopEffects();
  }, [enable, silence, stopEffects]);

  const playEffect = useCallback(async (name: OfficeSound) => {
    const audio = context.current;
    const epoch = effectEpoch.current;
    if (!active.current || !audio || document.hidden) return;
    try {
      await audio.resume();
      await effectLoading.current;
      const buffer = effects.current[name];
      if (!active.current || document.hidden || epoch !== effectEpoch.current || !buffer) return;
      const source = audio.createBufferSource();
      const volume = audio.createGain();
      source.buffer = buffer;
      volume.gain.value = name === 'fan' ? .035 : name === 'notification' || name === 'success' || name === 'lamp' || name.startsWith('sticker') ? .45 : .65;
      source.connect(volume);
      volume.connect(audio.destination);
      effectSources.current.add(source);
      source.onended = () => { effectSources.current.delete(source); source.disconnect(); volume.disconnect(); };
      // The supplied phone recording starts with about a second of silence.
      source.start(0, name === 'notification' ? 1.08 : 0);
    } catch { /* An unavailable effect must not interrupt the animation. */ }
  }, []);

  const tap = useCallback(() => {
    const audio = context.current;
    const samples = buffers.current;
    if (!active.current || !audio || audio.state !== 'running' || !samples.length || document.hidden) return;
    const index = (lastSample.current + 1 + Math.floor(Math.random() * Math.max(1, samples.length - 1))) % samples.length;
    lastSample.current = index;
    const source = audio.createBufferSource();
    const volume = audio.createGain();
    source.buffer = samples[index];
    source.playbackRate.value = 0.94 + Math.random() * 0.12;
    volume.gain.value = 0.12 + Math.random() * 0.06;
    source.connect(volume);
    volume.connect(audio.destination);
    playing.current.add(source);
    source.onended = () => { playing.current.delete(source); source.disconnect(); volume.disconnect(); };
    source.start();
  }, []);

  useEffect(() => () => {
    active.current = false;
    silence();
    stopEffects();
    void context.current?.close();
    context.current = null;
    if (music.current) {
      music.current.onplaying = music.current.onpause = music.current.onerror = null;
      music.current.pause();
      music.current.removeAttribute('src');
      music.current.load();
      music.current = null;
    }
  }, [silence, stopEffects]);

  return { enabled, unavailable, enable, toggle, tap, silence, playEffect, stopEffects, musicPlaying, toggleMusic, getMusicTime };
}
