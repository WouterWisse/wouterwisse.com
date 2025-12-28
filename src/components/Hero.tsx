'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCurrentMonth, useThemeMode } from '@/hooks';
import { getThemeForMonth, getColorsForMonth, LIGHT_BACKGROUND, DARK_BACKGROUND } from '@/config/themes';
import { SocialLinks } from './SocialLinks';
import { ThemeToggle } from './ThemeToggle';

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Hero() {
  const { displayedMonth, goToNextMonth, goToPrevMonth, direction } = useCurrentMonth();
  const { mode, toggleMode, mounted } = useThemeMode();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNextMonth();
      } else if (e.key === 'ArrowLeft') {
        goToPrevMonth();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextMonth, goToPrevMonth]);

  // Animation class based on navigation direction
  const slideClass = direction === 'right' ? 'slide-in-right' : direction === 'left' ? 'slide-in-left' : '';

  // Show loading state
  if (displayedMonth === null || !mounted) {
    return <section className="min-h-screen w-full bg-[#fafafa]" />;
  }

  const theme = getThemeForMonth(displayedMonth);
  const colors = getColorsForMonth(displayedMonth, mode);
  const themeColor = colors.top;
  const lightTheme = theme.light;
  const darkTheme = theme.dark;
  const modeTheme = theme[mode];
  const isDark = mode === 'dark';
  const bgColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  const textMuted = isDark ? '#a0a0b0' : '#94a3b8';

  return (
    <section
      className="h-screen w-full relative overflow-x-clip transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* Image - absolutely positioned, centered but offset up, behind everything */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pb-52 md:pb-60">
        <div
          key={`image-${displayedMonth}`}
          className={`relative w-[120vw] md:w-[90vw] lg:w-[80vw] max-w-4xl aspect-square ${slideClass}`}
          style={{
            maskImage: 'radial-gradient(circle, black 42%, transparent 67%)',
            WebkitMaskImage: 'radial-gradient(circle, black 42%, transparent 67%)',
          }}
        >
          <Image
            src={lightTheme.image}
            alt={lightTheme.alt}
            fill
            priority
            sizes="(max-width: 768px) 120vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isDark ? 0 : 1 }}
          />
          <Image
            src={darkTheme.image}
            alt={darkTheme.alt}
            fill
            priority
            sizes="(max-width: 768px) 120vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isDark ? 1 : 0 }}
          />
        </div>
      </div>

      {/* Top bar - Name and toggle */}
      <div className="relative flex justify-between items-start px-4 md:px-8 pt-4 md:pt-8 z-20">
        {/* Name */}
        <div>
          <div className="w-fit">
            <p
              className="font-body text-xs md:text-sm uppercase tracking-[0.3em] mb-2 md:mb-3 text-center transition-colors duration-700"
              style={{ color: textMuted }}
            >
              Full Stack Developer
            </p>
            <h1
              className="font-display text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.85] transition-colors duration-700"
              style={{ color: themeColor, fontWeight: 900 }}
            >
              Wouter
            </h1>
          </div>
          <h1
            className="font-display text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.85] transition-colors duration-700"
            style={{ color: themeColor, fontWeight: 900 }}
          >
            Wisse
          </h1>
        </div>
        {/* Theme toggle */}
        <ThemeToggle mode={mode} onToggle={toggleMode} color={themeColor} />
      </div>

      {/* Bottom - Tagline and socials */}
      <div className="absolute bottom-0 left-0 right-0 text-center z-20 px-4 md:px-8 pb-6 md:pb-8">
        {/* Month navigation */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <button
            onClick={goToPrevMonth}
            className="p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: textMuted }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <p
            key={`month-${displayedMonth}`}
            className={`font-body text-xs md:text-sm uppercase tracking-[0.3em] min-w-[100px] text-center ${slideClass}`}
            style={{ color: textMuted }}
          >
            {theme.name}
          </p>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: textMuted }}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <p
          key={`tagline-${displayedMonth}`}
          className={`font-display text-4xl md:text-4xl lg:text-5xl text-center max-w-[280px] md:max-w-3xl mx-auto ${slideClass}`}
          style={{ color: themeColor, fontWeight: 900 }}
        >
          {modeTheme.tagline.charAt(0).toUpperCase() + modeTheme.tagline.slice(1)}.
        </p>
        <div className="mt-4 md:mt-6 flex justify-center">
          <SocialLinks isDark={isDark} color={themeColor} />
        </div>
      </div>
    </section>
  );
}
