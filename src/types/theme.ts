export type Month =
  | 'january' | 'february' | 'march' | 'april'
  | 'may' | 'june' | 'july' | 'august'
  | 'september' | 'october' | 'november' | 'december';

export type Mode = 'light' | 'dark';

export interface MonthlyTheme {
  id: Month;
  name: string;
  light: {
    tagline: string;
    image: string;
    alt: string;
  };
  dark: {
    tagline: string;
    image: string;
    alt: string;
  };
}

export interface ThemeColors {
  top: string;
  bottom: string;
}

export interface ModeColors {
  light: ThemeColors;
  dark: ThemeColors;
}

export type ThemeConfig = Record<Month, MonthlyTheme>;
export type ColorsConfig = Record<Month, ModeColors>;
