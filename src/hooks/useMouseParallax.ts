'use client';

import { useMotionValue } from 'framer-motion';
import { useEffect, RefObject } from 'react';

export function useMouseParallax(containerRef: RefObject<HTMLElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const { clientX, clientY } = event;
      const { width, height, left, top } = container.getBoundingClientRect();

      // Normalize to -1 to 1 range
      const normalizedX = ((clientX - left) / width) * 2 - 1;
      const normalizedY = ((clientY - top) / height) * 2 - 1;

      x.set(normalizedX);
      y.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef, x, y]);

  return { x, y };
}
