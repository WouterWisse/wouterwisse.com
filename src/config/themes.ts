import type { Month, MonthlyTheme, ThemeConfig } from '@/types/theme';

const THEMES: ThemeConfig = {
  january: {
    id: 'january',
    name: 'January',
    tagline: 'Currently carving fresh powder in the Alps',
    image: '/images/themes/january/scene.png',
    alt: 'Wouter skiing on a floating snowy mountain island',
  },
  february: {
    id: 'february',
    name: 'February',
    tagline: 'Cozied up with a good book',
    image: '/images/themes/february/scene.png',
    alt: 'Wouter reading by the fireplace on a cozy floating island',
  },
  march: {
    id: 'march',
    name: 'March',
    tagline: 'Training for triathlon season',
    image: '/images/themes/march/scene.png',
    alt: 'Wouter running on a floating spring park island',
  },
  april: {
    id: 'april',
    name: 'April',
    tagline: 'Putting in the spring miles',
    image: '/images/themes/april/scene.png',
    alt: 'Wouter cycling on a floating countryside island',
  },
  may: {
    id: 'may',
    name: 'May',
    tagline: 'Building things in the sunshine',
    image: '/images/themes/may/scene.png',
    alt: 'Wouter coding outdoors on a floating park island',
  },
  june: {
    id: 'june',
    name: 'June',
    tagline: 'Open water training mode',
    image: '/images/themes/june/scene.png',
    alt: 'Wouter swimming at a floating lake island',
  },
  july: {
    id: 'july',
    name: 'July',
    tagline: 'Catching waves between commits',
    image: '/images/themes/july/scene.png',
    alt: 'Wouter surfing on a floating tropical beach island',
  },
  august: {
    id: 'august',
    name: 'August',
    tagline: 'Recharging on a tropical island',
    image: '/images/themes/august/scene.png',
    alt: 'Wouter relaxing in a hammock on a floating paradise island',
  },
  september: {
    id: 'september',
    name: 'September',
    tagline: 'Back to building cool things',
    image: '/images/themes/september/scene.png',
    alt: 'Wouter coding at a desk on a floating office island',
  },
  october: {
    id: 'october',
    name: 'October',
    tagline: 'Weekend garage project mode',
    image: '/images/themes/october/scene.png',
    alt: 'Wouter working on a car in a floating garage island',
  },
  november: {
    id: 'november',
    name: 'November',
    tagline: 'Fall evenings with a good book',
    image: '/images/themes/november/scene.png',
    alt: 'Wouter reading in a cozy floating nook island',
  },
  december: {
    id: 'december',
    name: 'December',
    tagline: 'Shipping features before the holidays',
    image: '/images/themes/december/scene.png',
    alt: 'Wouter coding with holiday decorations on a floating winter island',
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

export function getAllThemes(): MonthlyTheme[] {
  return Object.values(THEMES);
}

export default THEMES;
