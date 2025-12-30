import type { Month, MonthlyTheme, ThemeConfig, ThemeColors, ModeColors, Mode } from '@/types/theme';
import { EXTRACTED_COLORS } from './extracted-colors';

// Use auto-extracted colors from images
// Run: npm run generate-theme-colors
const MONTH_COLORS: Record<Month, ModeColors> = EXTRACTED_COLORS;

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
      tagline: 'beanie snug, deploy bug',
      image: '/images/themes/february/light.png',
      alt: 'Wouter at desk with beanie and slippers, coding on ultrawide monitor',
    },
    dark: {
      tagline: '2 am vibes, morning yikes',
      image: '/images/themes/february/dark.png',
      alt: 'Wouter coding in bed with laptop and glasses',
    },
  },
  march: {
    id: 'march',
    name: 'March',
    light: {
      tagline: 'morning run, sprints done',
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
      tagline: 'gears click, hotfix quick',
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
      alt: 'Wouter with wireless headphones coding on MacBook in sunny park',
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
      tagline: 'take a dip, features ship',
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
      tagline: 'waves fade, deploy delayed',
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
      alt: 'Wouter with helmet working on laptop open on parked motorcycle seat',
    },
    dark: {
      tagline: 'bike parked, mind embarked',
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
      alt: 'Wouter with light stubble coding at desk surrounded by many plants',
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
      tagline: 'from YouTube mechanic, to kernel panic',
      image: '/images/themes/october/light.png',
      alt: 'Wouter working on Porsche with iPhone in one hand and wrench in other',
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
      tagline: 'coffee steams, shipping dreams',
      image: '/images/themes/november/light.png',
      alt: 'Wouter coding in armchair with coffee',
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
