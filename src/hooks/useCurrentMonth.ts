'use client';

import { useState, useEffect } from 'react';

export function useCurrentMonth(): number {
  // Default to current month for SSR (will update on client)
  const [month, setMonth] = useState(() => {
    // Server-side: default to 0 (January)
    if (typeof window === 'undefined') return 0;
    return new Date().getMonth();
  });

  useEffect(() => {
    setMonth(new Date().getMonth());
  }, []);

  return month;
}
