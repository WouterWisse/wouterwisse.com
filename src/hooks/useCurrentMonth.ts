'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseCurrentMonthReturn {
  displayedMonth: number | null;
  actualMonth: number | null;
  direction: 'left' | 'right' | null;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
}

export function useCurrentMonth(): UseCurrentMonthReturn {
  const [actualMonth, setActualMonth] = useState<number | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const month = new Date().getMonth();
    setActualMonth(month);
    setDisplayedMonth(month);
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection('right');
    setDisplayedMonth((prev) => (prev !== null ? (prev + 1) % 12 : null));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setDirection('left');
    setDisplayedMonth((prev) => (prev !== null ? (prev - 1 + 12) % 12 : null));
  }, []);

  return {
    displayedMonth,
    actualMonth,
    direction,
    goToNextMonth,
    goToPrevMonth,
  };
}
