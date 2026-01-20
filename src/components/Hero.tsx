'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCurrentMonth, useThemeMode } from '@/hooks';
import { getThemeForMonth, getColorsForMonth, getDailyImagePath, LIGHT_BACKGROUND, DARK_BACKGROUND } from '@/config/themes';
import { getBlurDataURL } from '@/config/blur-placeholders';
import { WORK_IMAGE_PATHS, WORK_BLUR_DATA, WORK_DISPLAY_DURATION, WORK_TAGLINES } from '@/config/work';
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

const SWIPE_THRESHOLD = 50;

export function Hero() {
  const { displayedMonth, goToNextMonth, goToPrevMonth, direction } = useCurrentMonth();
  const { mode, toggleMode, mounted } = useThemeMode();

  // Work mode state - shows secret project sneak peek
  const [isWorkMode, setIsWorkMode] = useState(false);
  const workTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleWorkClick = useCallback(() => {
    if (isWorkMode) return; // Prevent clicking while already showing

    setIsWorkMode(true);

    // Clear any existing timer
    if (workTimerRef.current) {
      clearTimeout(workTimerRef.current);
    }

    // Set timer to return to normal view
    workTimerRef.current = setTimeout(() => {
      setIsWorkMode(false);
      workTimerRef.current = null;
    }, WORK_DISPLAY_DURATION);
  }, [isWorkMode]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (workTimerRef.current) {
        clearTimeout(workTimerRef.current);
      }
    };
  }, []);

  // Daily image paths with fallback (use month 0 as default for hooks consistency)
  const effectiveMonth = displayedMonth ?? 0;
  const lightPaths = getDailyImagePath(effectiveMonth, 'light');
  const darkPaths = getDailyImagePath(effectiveMonth, 'dark');

  // Track which images to use (daily or fallback)
  const [lightSrc, setLightSrc] = useState(lightPaths.daily);
  const [darkSrc, setDarkSrc] = useState(darkPaths.daily);

  // Reset to daily images when month changes
  useEffect(() => {
    setLightSrc(lightPaths.daily);
    setDarkSrc(darkPaths.daily);
  }, [lightPaths.daily, darkPaths.daily]);

  const handleLightError = useCallback(() => {
    setLightSrc(lightPaths.fallback);
  }, [lightPaths.fallback]);

  const handleDarkError = useCallback(() => {
    setDarkSrc(darkPaths.fallback);
  }, [darkPaths.fallback]);

  // Keyboard navigation (disabled during work mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable keyboard navigation during work mode
      if (isWorkMode) return;

      if (e.key === 'ArrowRight') {
        goToNextMonth();
      } else if (e.key === 'ArrowLeft') {
        goToPrevMonth();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextMonth, goToPrevMonth, isWorkMode]);

  // Sync background color to html element and meta theme-color for browser UI
  useEffect(() => {
    if (!mounted) return;
    const bgColor = mode === 'dark' ? DARK_BACKGROUND : LIGHT_BACKGROUND;
    document.documentElement.style.backgroundColor = bgColor;

    // Update or create meta theme-color for browser UI (address bar, status bar)
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', bgColor);
  }, [mode, mounted]);

  // Animation class based on navigation direction
  const slideClass = direction === 'right' ? 'slide-in-right' : direction === 'left' ? 'slide-in-left' : '';

  // Show loading state
  if (displayedMonth === null || !mounted) {
    return <section className="min-h-dvh w-full bg-[#fafafa]" />;
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

  const handlePanEnd = (_: unknown, info: { offset: { x: number } }) => {
    // Disable swiping during work mode
    if (isWorkMode) return;

    if (info.offset.x > SWIPE_THRESHOLD) {
      goToPrevMonth();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goToNextMonth();
    }
  };

  return (
    <motion.section
      className="h-dvh w-full relative overflow-clip transition-colors duration-700 ease-in-out touch-pan-y"
      style={{ backgroundColor: bgColor }}
      onPanEnd={handlePanEnd}
    >
      {/* Image - positioned to allow overflow below viewport */}
      <div className="absolute inset-x-0 top-0 bottom-0 flex items-start justify-center z-0 pt-[5dvh] md:pt-[10dvh]">
        {/* Simple radial gradient fade */}
        <div
          key={`image-${displayedMonth}`}
          className={`relative h-[70dvh] md:h-[80dvh] aspect-square ${slideClass}`}
          style={{
            maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, black 70%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, black 70%, transparent 95%)',
          }}
        >
          <Image
            src={lightSrc}
            alt={lightTheme.alt}
            fill
            priority
            sizes="(max-width: 768px) 130vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isDark ? 0 : 1 }}
            placeholder="blur"
            blurDataURL={getBlurDataURL(theme.id, 'light')}
            onError={handleLightError}
          />
          <Image
            src={darkSrc}
            alt={darkTheme.alt}
            fill
            priority
            sizes="(max-width: 768px) 130vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isDark ? 1 : 0 }}
            placeholder="blur"
            blurDataURL={getBlurDataURL(theme.id, 'dark')}
            onError={handleDarkError}
          />
          {/* Work mode images - overlay on top of regular images */}
          <Image
            src={WORK_IMAGE_PATHS.light}
            alt="Working on a secret project"
            fill
            sizes="(max-width: 768px) 130vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isWorkMode && !isDark ? 1 : 0 }}
            placeholder="blur"
            blurDataURL={WORK_BLUR_DATA.light}
          />
          <Image
            src={WORK_IMAGE_PATHS.dark}
            alt="Working on a secret project"
            fill
            sizes="(max-width: 768px) 130vw, 800px"
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: isWorkMode && isDark ? 1 : 0 }}
            placeholder="blur"
            blurDataURL={WORK_BLUR_DATA.dark}
          />
        </div>
      </div>

      {/* Top bar - Name and toggle */}
      <div className="relative pt-4 md:pt-8 z-20">
        {/* Theme toggle - positioned absolutely on the right */}
        <div className="absolute top-4 md:top-8 right-4 md:right-8">
          <ThemeToggle mode={mode} onToggle={toggleMode} color={themeColor} />
        </div>
        {/* Name - left-aligned text, centered container on wide screens */}
        <div className="px-4 md:px-8 lg:flex lg:justify-center">
          <div className="lg:w-[800px]">
            <div className="w-fit text-center">
              <p
                className="font-body text-sm md:text-base font-bold tracking-[0.3em] mb-2 md:mb-3 transition-colors duration-700"
                style={{ color: textMuted }}
              >
                full stack dev
              </p>
              <h1
                className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.85]"
                style={{
                  color: themeColor,
                  fontWeight: 900,
                  textShadow: `0 0 20px ${bgColor}99, 0 0 40px ${bgColor}80, 0 0 60px ${bgColor}66`,
                  transition: 'color 700ms cubic-bezier(0.4, 0, 0.2, 1), text-shadow 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Wouter
              </h1>
              <h1
                className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight leading-[0.85]"
                style={{
                  color: themeColor,
                  fontWeight: 900,
                  textShadow: `0 0 20px ${bgColor}99, 0 0 40px ${bgColor}80, 0 0 60px ${bgColor}66`,
                  transition: 'color 700ms cubic-bezier(0.4, 0, 0.2, 1), text-shadow 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Wisse
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Tagline and socials */}
      <div className="absolute bottom-0 left-0 right-0 text-center z-20 px-4 md:px-8 pb-6 md:pb-8">
        {/* Month navigation - fades out in work mode */}
        <div
          className="flex items-center justify-center gap-3 mb-2 transition-opacity duration-700"
          style={{ opacity: isWorkMode ? 0 : 1 }}
        >
          <button
            onClick={goToPrevMonth}
            className="p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: textMuted }}
            aria-label="Previous month"
            disabled={isWorkMode}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <p
            key={`month-${displayedMonth}`}
            className={`font-body text-sm md:text-base font-bold lowercase tracking-[0.3em] min-w-[100px] text-center ${slideClass}`}
            style={{ color: textMuted }}
          >
            {theme.name}
          </p>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ color: textMuted }}
            aria-label="Next month"
            disabled={isWorkMode}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <p
          key={isWorkMode ? 'work-tagline' : `tagline-${displayedMonth}`}
          className={`font-display text-4xl md:text-4xl lg:text-5xl text-center max-w-[280px] md:max-w-3xl mx-auto transition-opacity duration-700 ${isWorkMode ? '' : slideClass}`}
          style={{ color: themeColor, fontWeight: 900 }}
        >
          {isWorkMode
            ? WORK_TAGLINES[mode].charAt(0).toUpperCase() + WORK_TAGLINES[mode].slice(1) + '.'
            : modeTheme.tagline.charAt(0).toUpperCase() + modeTheme.tagline.slice(1) + '.'}
        </p>
        <div className="mt-4 md:mt-6 flex justify-center">
          <SocialLinks isDark={isDark} color={themeColor} onWorkClick={handleWorkClick} isWorkActive={isWorkMode} />
        </div>
      </div>
    </motion.section>
  );
}
