'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface ParallaxLayerProps {
  image: string;
  alt: string;
  depth?: number;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  priority?: boolean;
}

export function ParallaxLayer({
  image,
  alt,
  depth = 0,
  x,
  y,
  priority = false,
}: ParallaxLayerProps) {
  // Transform normalized input (-1 to 1) to pixel offset
  // Higher depth = more movement
  const maxOffset = 30 * depth;

  const translateX = useTransform(
    x ?? { get: () => 0 } as MotionValue<number>,
    [-1, 1],
    [-maxOffset, maxOffset]
  );
  const translateY = useTransform(
    y ?? { get: () => 0 } as MotionValue<number>,
    [-1, 1],
    [-maxOffset * 0.6, maxOffset * 0.6]
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-transform flex items-center justify-center"
      style={{
        x: translateX,
        y: translateY,
      }}
    >
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 672px"
        className="object-contain"
      />
    </motion.div>
  );
}
