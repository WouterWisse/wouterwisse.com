import type { Month, MonthlyTheme, ThemeConfig, ThemeColors, ModeColors, Mode } from '@/types/theme';

// Handpicked colors for each month that work well with light (#fafafa) and dark (#1a1025) backgrounds
const MONTH_COLORS: Record<Month, ModeColors> = {
  january: {
    light: { top: '#1e3a5f', bottom: '#1e3a5f' },    // Deep winter blue
    dark: { top: '#7dd3fc', bottom: '#7dd3fc' },     // Light sky blue
  },
  february: {
    light: { top: '#7c2d12', bottom: '#7c2d12' },    // Warm brown (fireplace)
    dark: { top: '#fdba74', bottom: '#fdba74' },     // Soft orange glow
  },
  march: {
    light: { top: '#166534', bottom: '#166534' },    // Spring green
    dark: { top: '#86efac', bottom: '#86efac' },     // Light green
  },
  april: {
    light: { top: '#0e7490', bottom: '#0e7490' },    // Cycling teal
    dark: { top: '#67e8f9', bottom: '#67e8f9' },     // Bright cyan
  },
  may: {
    light: { top: '#4d7c0f', bottom: '#4d7c0f' },    // Fresh grass green
    dark: { top: '#bef264', bottom: '#bef264' },     // Lime green
  },
  june: {
    light: { top: '#0369a1', bottom: '#0369a1' },    // Ocean blue
    dark: { top: '#38bdf8', bottom: '#38bdf8' },     // Light blue
  },
  july: {
    light: { top: '#c2410c', bottom: '#c2410c' },    // Sunset orange
    dark: { top: '#fb923c', bottom: '#fb923c' },     // Bright orange
  },
  august: {
    light: { top: '#0f766e', bottom: '#0f766e' },    // Tropical teal
    dark: { top: '#5eead4', bottom: '#5eead4' },     // Turquoise
  },
  september: {
    light: { top: '#4338ca', bottom: '#4338ca' },    // Deep indigo (back to work)
    dark: { top: '#a5b4fc', bottom: '#a5b4fc' },     // Soft indigo
  },
  october: {
    light: { top: '#9a3412', bottom: '#9a3412' },    // Rust orange (autumn)
    dark: { top: '#fb923c', bottom: '#fb923c' },     // Warm orange
  },
  november: {
    light: { top: '#78350f', bottom: '#78350f' },    // Cozy brown
    dark: { top: '#fcd34d', bottom: '#fcd34d' },     // Warm yellow
  },
  december: {
    light: { top: '#b91c1c', bottom: '#b91c1c' },    // Christmas red
    dark: { top: '#fca5a5', bottom: '#fca5a5' },     // Soft red/pink
  },
};

const THEMES: ThemeConfig = {
  january: {
    id: 'january',
    name: 'January',
    light: {
      tagline: 'powder day, ship anyway',
      image: '/images/themes/january/light.png',
      alt: 'Wouter skiing while coding on MacBook',
    },
    dark: {
      tagline: 'fire bright, prod\'s alright... right?',
      image: '/images/themes/january/dark.png',
      alt: 'Wouter by fireplace with deployed code and fondue',
    },
  },
  february: {
    id: 'february',
    name: 'February',
    light: {
      tagline: 'beanie snug, shipping bugs',
      image: '/images/themes/february/light.png',
      alt: 'Wouter at desk with beanie and slippers, coding on ultrawide monitor',
    },
    dark: {
      tagline: '2am flow, morning: oh no',
      image: '/images/themes/february/dark.png',
      alt: 'Wouter coding in bed with laptop and glasses',
    },
  },
  march: {
    id: 'march',
    name: 'March',
    light: {
      tagline: 'morning run, sprints get done',
      image: '/images/themes/march/light.png',
      alt: 'Wouter running while coding on MacBook',
    },
    dark: {
      tagline: 'runner crashed, build passed',
      image: '/images/themes/march/dark.png',
      alt: 'Wouter collapsed after run with medal and MacBook',
    },
  },
  april: {
    id: 'april',
    name: 'April',
    light: {
      tagline: 'high cadence, zero patience',
      image: '/images/themes/april/light.png',
      alt: 'Wouter cycling while coding on handlebar-mounted laptop',
    },
    dark: {
      tagline: 'tire flat, hotfix that',
      image: '/images/themes/april/dark.png',
      alt: 'Wouter with flat tire googling how to fix it',
    },
  },
  may: {
    id: 'may',
    name: 'May',
    light: {
      tagline: 'grass green, code clean',
      image: '/images/themes/may/light.png',
      alt: 'Wouter coding on MacBook in sunny park',
    },
    dark: {
      tagline: 'nap attack, prod goes black',
      image: '/images/themes/may/dark.png',
      alt: 'Wouter napping on bench with MacBook on chest',
    },
  },
  june: {
    id: 'june',
    name: 'June',
    light: {
      tagline: 'deep water, shallow documentation',
      image: '/images/themes/june/light.png',
      alt: 'Wouter treading water while holding MacBook',
    },
    dark: {
      tagline: 'float and sip, while servers dip',
      image: '/images/themes/june/dark.png',
      alt: 'Wouter floating on flamingo with cocktail and phone',
    },
  },
  july: {
    id: 'july',
    name: 'July',
    light: {
      tagline: 'surf the tide, bugs can\'t hide',
      image: '/images/themes/july/light.png',
      alt: 'Wouter surfing while coding on MacBook',
    },
    dark: {
      tagline: 'tide\'s out, prod\'s out',
      image: '/images/themes/july/dark.png',
      alt: 'Wouter asleep on beach with surfboard and MacBook',
    },
  },
  august: {
    id: 'august',
    name: 'August',
    light: {
      tagline: 'throttle high, bugs won\'t die',
      image: '/images/themes/august/light.png',
      alt: 'Wouter on motorcycle coding on tank-mounted laptop',
    },
    dark: {
      tagline: 'ignition off, thoughts off',
      image: '/images/themes/august/dark.png',
      alt: 'Wouter asleep in hammock with MacBook on chest',
    },
  },
  september: {
    id: 'september',
    name: 'September',
    light: {
      tagline: 'plants thriving, dev surviving',
      image: '/images/themes/september/light.png',
      alt: 'Wouter coding at his desk with multiple monitors',
    },
    dark: {
      tagline: 'desk sleep, bugs creep',
      image: '/images/themes/september/dark.png',
      alt: 'Wouter asleep at desk on keyboard',
    },
  },
  october: {
    id: 'october',
    name: 'October',
    light: {
      tagline: 'YouTube mechanic, Stack Overflow panic',
      image: '/images/themes/october/light.png',
      alt: 'Wouter working on Porsche while checking phone',
    },
    dark: {
      tagline: 'DIY tried, dreams died',
      image: '/images/themes/october/dark.png',
      alt: 'Wouter under car with YouTube tutorial on MacBook',
    },
  },
  november: {
    id: 'november',
    name: 'November',
    light: {
      tagline: 'tea steams, ship dreams',
      image: '/images/themes/november/light.png',
      alt: 'Wouter coding in armchair with tea',
    },
    dark: {
      tagline: 'chapters read, prod is dead',
      image: '/images/themes/november/dark.png',
      alt: 'Wouter asleep in armchair with book and MacBook',
    },
  },
  december: {
    id: 'december',
    name: 'December',
    light: {
      tagline: 'one-eighty thrown, bugs unknown',
      image: '/images/themes/december/light.png',
      alt: 'Wouter coding by Christmas tree with hot cocoa',
    },
    dark: {
      tagline: 'feast deployed, dev destroyed',
      image: '/images/themes/december/dark.png',
      alt: 'Wouter passed out at Christmas dinner table after feast',
    },
  },
};

const MONTHS: Month[] = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

export function getThemeForMonth(monthIndex: number): MonthlyTheme {
  const monthKey = MONTHS[monthIndex] || 'january';
  return THEMES[monthKey];
}

export function getColorsForMonth(monthIndex: number, mode: Mode = 'light'): ThemeColors {
  const monthKey = MONTHS[monthIndex] || 'january';
  return MONTH_COLORS[monthKey][mode];
}

export function getAllThemes(): MonthlyTheme[] {
  return Object.values(THEMES);
}

// Background colors for CSS
export const LIGHT_BACKGROUND = '#fafafa';
export const DARK_BACKGROUND = '#1a1025';

export default THEMES;
