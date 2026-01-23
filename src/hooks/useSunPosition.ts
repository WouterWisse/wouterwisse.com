import SunCalc from 'suncalc';

// Default coordinates (Amsterdam, Netherlands)
const DEFAULT_LAT = 52.3676;
const DEFAULT_LNG = 4.9041;

/**
 * Synchronous function to check if it's daytime at a given location.
 * Uses SunCalc to determine sunrise/sunset times.
 */
export function isDaytime(lat = DEFAULT_LAT, lng = DEFAULT_LNG): boolean {
  const now = new Date();
  const times = SunCalc.getTimes(now, lat, lng);
  return now >= times.sunrise && now < times.sunset;
}
