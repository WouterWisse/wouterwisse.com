export type Month =
  | 'january' | 'february' | 'march' | 'april'
  | 'may' | 'june' | 'july' | 'august'
  | 'september' | 'october' | 'november' | 'december';

export interface MonthlyTheme {
  id: Month;
  name: string;
  tagline: string;
  image: string;  // Single scene image
  alt: string;
}

export type ThemeConfig = Record<Month, MonthlyTheme>;
