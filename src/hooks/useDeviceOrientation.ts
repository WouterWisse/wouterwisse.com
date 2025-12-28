'use client';

import { useState, useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

export function useDeviceOrientation() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;

      if (beta === null || gamma === null) {
        return;
      }

      setIsSupported(true);

      // Normalize to -1 to 1 range
      // beta: front-to-back tilt (-180 to 180), gamma: left-to-right (-90 to 90)
      const normalizedX = Math.max(-1, Math.min(1, gamma / 45));
      const normalizedY = Math.max(-1, Math.min(1, (beta - 45) / 45));

      x.set(normalizedX);
      y.set(normalizedY);
    };

    // Request permission on iOS 13+
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('Device orientation permission denied:', error);
        }
      } else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [x, y]);

  return { x, y, isSupported };
}
