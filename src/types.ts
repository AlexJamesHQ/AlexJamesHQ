export interface HeroChip {
  icon: string;
  label: string;
}

export interface HeroConfig {
  greeting: string;
  name: string;
  subtitle: string;
  typing: boolean;
  avatarShape: 'cookie' | 'cookie12' | 'clover' | 'sunny' | 'flower' | 'pill';
  avatarUrl?: string;
  chips: HeroChip[];
}

export interface AboutItem {
  icon: string;
  label: string;
}

export interface AboutConfig {
  title: string;
  items: AboutItem[];
}

export interface StackItem {
  icon: string;
  label: string;
}

export interface StackGroup {
  title: string;
  items: StackItem[];
}

export interface StackConfig {
  title: string;
  groups: StackGroup[];
}

export interface PinnedRepo {
  name: string;
  url: string;
  text: string;
  fork: boolean;
  stars: number;
  language: string;
  topics: string[];
}

export interface ProjectsConfig {
  source: 'pinned' | 'manual';
  repos: string[];
  overrides: Record<string, Partial<PinnedRepo>>;
  empty: string;
  fork: string;
}

export interface StatsConfig {
  title: string;
  stars: string;
  contributions: string;
  repos: string;
  followers: string;
  calendar: string;
  weekdays: string;
  languages: string;
  showLanguages: boolean;
}

export interface StreakConfig {
  title: string;
  current: string;
  longest: string;
  days: string;
  currentStreakCount?: number;
  longestStreakCount?: number;
}

export interface SocialItem {
  icon: string;
  url: string;
}

export interface SocialsConfig {
  items: SocialItem[];
  variant: 'chip' | 'icon' | 'badge';
  fill: 'tonal' | 'outlined' | 'filled';
  card: boolean;
}

export interface ButtonItem {
  icon: string;
  label: string;
  url: string;
  style: 'filled' | 'tonal' | 'outlined';
}

export interface ButtonsConfig {
  items: ButtonItem[];
}

export interface ProfileConfig {
  version: number;
  login: string;
  seed: string;
  seedFromAvatar: boolean;
  scheme: string;
  motion: boolean;
  iconFill: boolean;
  order: Array<'hero' | 'socials' | 'about' | 'stack' | 'projects' | 'stats' | 'streak' | 'wave' | 'buttons'>;
  hidden: string[];
  hero: HeroConfig;
  about: AboutConfig;
  stack: StackConfig;
  projects: ProjectsConfig;
  stats: StatsConfig;
  streak: StreakConfig;
  socials: SocialsConfig;
  buttons: ButtonsConfig;
}

export interface CalendarDay {
  c: number;
  day: number;
  today: boolean;
}

export interface StatsData {
  stars: number;
  contributions: number;
  repos: number;
  followers: number;
  languages: [string, number][];
  days: (CalendarDay | null)[][];
  pins: PinnedRepo[];
  avatar?: string;
}

export interface PaletteTheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  surface: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
}

export interface PaletteData {
  light: PaletteTheme;
  dark: PaletteTheme;
}

export interface IconsData {
  brand: Record<string, string>;
  symbol: Record<string, { vb: string; d: string }>;
}
