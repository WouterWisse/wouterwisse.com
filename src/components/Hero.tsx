'use client';

import { useCurrentMonth } from '@/hooks';
import { getThemeForMonth } from '@/config/themes';
import { ParallaxScene } from './ParallaxScene';
import { ProfileContent } from './ProfileContent';

export function Hero() {
  const currentMonth = useCurrentMonth();
  const theme = getThemeForMonth(currentMonth);

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      {/* Text content ABOVE the images */}
      <ProfileContent theme={theme} />

      {/* Parallax images below */}
      <div className="relative w-full max-w-2xl aspect-square mt-8">
        <ParallaxScene theme={theme} />
      </div>
    </section>
  );
}
