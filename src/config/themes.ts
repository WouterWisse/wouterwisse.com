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
      tagline: 'carving powder and squashing bugs',
      image: '/images/themes/january/light.png',
      alt: 'Wouter skiing in the Alps with MacBook in backpack',
    },
    dark: {
      tagline: 'git checkout --branch beer',
      image: '/images/themes/january/dark.png',
      alt: 'Wouter at après-ski with beer and fondue',
    },
  },
  february: {
    id: 'february',
    name: 'February',
    light: {
      tagline: 'refactoring my reading list by the fire',
      image: '/images/themes/february/light.png',
      alt: 'Wouter reading by the fireplace with MacBook',
    },
    dark: {
      tagline: '404: reader not found',
      image: '/images/themes/february/dark.png',
      alt: 'Wouter passed out on couch with book',
    },
  },
  march: {
    id: 'march',
    name: 'March',
    light: {
      tagline: 'running sprints, both kinds',
      image: '/images/themes/march/light.png',
      alt: 'Wouter running on a spring trail',
    },
    dark: {
      tagline: 'ran out of breath and semicolons',
      image: '/images/themes/march/dark.png',
      alt: 'Wouter collapsed after run with energy gels',
    },
  },
  april: {
    id: 'april',
    name: 'April',
    light: {
      tagline: 'spinning up servers and pedals',
      image: '/images/themes/april/light.png',
      alt: 'Wouter cycling through countryside',
    },
    dark: {
      tagline: 'asking Claude how to patch a tube',
      image: '/images/themes/april/dark.png',
      alt: 'Wouter with flat tire looking confused',
    },
  },
  may: {
    id: 'may',
    name: 'May',
    light: {
      tagline: 'vibe coding where the WiFi is weak but the sun is strong',
      image: '/images/themes/may/light.png',
      alt: 'Wouter coding on MacBook in sunny park',
    },
    dark: {
      tagline: 'Thread.sleep(MAX_VALUE)',
      image: '/images/themes/may/dark.png',
      alt: 'Wouter napping on bench, MacBook closed',
    },
  },
  june: {
    id: 'june',
    name: 'June',
    light: {
      tagline: 'diving into legacy code, wetsuit recommended',
      image: '/images/themes/june/light.png',
      alt: 'Wouter ready to swim at the lake',
    },
    dark: {
      tagline: 'float: left; worries: none;',
      image: '/images/themes/june/dark.png',
      alt: 'Wouter floating on flamingo with cocktail',
    },
  },
  july: {
    id: 'july',
    name: 'July',
    light: {
      tagline: 'catching waves between commits',
      image: '/images/themes/july/light.png',
      alt: 'Wouter with surfboard, MacBook on beach towel',
    },
    dark: {
      tagline: 'connection timed out, tan maxed out',
      image: '/images/themes/july/dark.png',
      alt: 'Wouter sleeping on beach at sunset',
    },
  },
  august: {
    id: 'august',
    name: 'August',
    light: {
      tagline: 'async/await in paradise',
      image: '/images/themes/august/light.png',
      alt: 'Wouter in hammock with MacBook and coconut',
    },
    dark: {
      tagline: 'try { vacation } finally { sleep }',
      image: '/images/themes/august/dark.png',
      alt: 'Wouter passed out in hammock with cocktail',
    },
  },
  september: {
    id: 'september',
    name: 'September',
    light: {
      tagline: 'tan fading, letting Claude cook',
      image: '/images/themes/september/light.png',
      alt: 'Wouter coding at his desk',
    },
    dark: {
      tagline: 'git commit -m "zzzzzzzz"',
      image: '/images/themes/september/dark.png',
      alt: 'Wouter asleep at desk on keyboard',
    },
  },
  october: {
    id: 'october',
    name: 'October',
    light: {
      tagline: 'debugging engines, both V8s',
      image: '/images/themes/october/light.png',
      alt: 'Wouter working on car with laptop for manuals',
    },
    dark: {
      tagline: 'stack overflow: pizza and motor oil edition',
      image: '/images/themes/october/dark.png',
      alt: 'Wouter under car with pizza and beer',
    },
  },
  november: {
    id: 'november',
    name: 'November',
    light: {
      tagline: 'cozy vibes and clean builds',
      image: '/images/themes/november/light.png',
      alt: 'Wouter reading with tea and MacBook nearby',
    },
    dark: {
      tagline: 'book on face, bugs in production',
      image: '/images/themes/november/dark.png',
      alt: 'Wouter asleep with book on face and cat',
    },
  },
  december: {
    id: 'december',
    name: 'December',
    light: {
      tagline: 'wrapping presents and promises',
      image: '/images/themes/december/light.png',
      alt: 'Wouter with MacBook among holiday decorations',
    },
    dark: {
      tagline: 'force push cookies in my face',
      image: '/images/themes/december/dark.png',
      alt: 'Wouter in food coma with wine and cookies',
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
