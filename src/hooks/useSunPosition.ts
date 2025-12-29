'use client';

import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';

// Default coordinates (Amsterdam, Netherlands)
const DEFAULT_LAT = 52.3676;
const DEFAULT_LNG = 4.9041;

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  isDaytime: boolean;
}

export function useSunPosition() {
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateSunTimes = (lat: number, lng: number) => {
      const now = new Date();
      const times = SunCalc.getTimes(now, lat, lng);

      const isDaytime = now >= times.sunrise && now < times.sunset;

      setSunTimes({
        sunrise: times.sunrise,
        sunset: times.sunset,
        isDaytime,
      });
      setLoading(false);
    };

    // Try to get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          calculateSunTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Geolocation failed or denied, use default
          calculateSunTimes(DEFAULT_LAT, DEFAULT_LNG);
        },
        { timeout: 5000 }
      );
    } else {
      // Geolocation not available, use default
      calculateSunTimes(DEFAULT_LAT, DEFAULT_LNG);
    }
  }, []);

  return { sunTimes, loading };
}

/**
 * Synchronous function to check if it's daytime at a given location.
 * Useful for getting an immediate result without waiting for geolocation.
 */
export function isDaytime(lat = DEFAULT_LAT, lng = DEFAULT_LNG): boolean {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lng);
  return now >= times.sunrise && now < times.sunset;
}
