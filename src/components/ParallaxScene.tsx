'use client';

import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useMouseParallax, useReducedMotion } from '@/hooks';
import type { MonthlyTheme } from '@/types/theme';

interface ParallaxSceneProps {
  theme: MonthlyTheme;
}

export function ParallaxScene({ theme }: ParallaxSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse tracking for subtle parallax
  const { x: mouseX, y: mouseY } = useMouseParallax(containerRef);

  // Spring physics for smooth animation
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Static version for accessibility
  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className="relative w-full h-full">
        <Image
          src={theme.image}
          alt={theme.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <motion.div
        className="relative w-full h-full"
        style={{
          x: x.get() * 15, // Subtle horizontal movement
          y: y.get() * 10, // Subtle vertical movement
          rotateX: y.get() * -3, // Slight 3D tilt
          rotateY: x.get() * 3,
        }}
      >
        <Image
          src={theme.image}
          alt={theme.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}
