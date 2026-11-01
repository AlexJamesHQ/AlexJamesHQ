import { ProfileConfig, StatsData, PaletteData, IconsData } from '../types';
import paletteJson from './palette.json';
import statsJson from './stats.json';
import iconsJson from './icons.json';
import alexAvatarJson from './alexAvatar.json';

export const DEFAULT_PROFILE: ProfileConfig = {
  version: 1,
  login: 'AlexJamesHQ',
  seed: '#FF5CA8',
  seedFromAvatar: false,
  scheme: 'tonalSpot',
  motion: true,
  iconFill: true,
  order: [
    'hero',
    'socials',
    'about',
    'stack',
    'projects',
    'stats',
    'streak',
    'wave',
    'buttons',
  ],
  hidden: [],
  hero: {
    greeting: "Hi, I'm",
    name: 'Alex James',
    subtitle: 'Full-stack developer & web designer.\nCrafting modern web applications & digital experiences.',
    typing: true,
    avatarShape: 'cookie12',
    avatarUrl: (alexAvatarJson as { avatar: string }).avatar,
    chips: [
      {
        icon: 'location_on',
        label: 'Bangladesh',
      },
      {
        icon: 'person',
        label: 'Full-Stack Dev',
      },
      {
        icon: 'code',
        label: 'React · TypeScript · Node.js',
      },
    ],
  },
  about: {
    title: 'About me',
    items: [
      {
        icon: 'person',
        label: 'Alex James — Full-stack Developer',
      },
      {
        icon: 'code',
        label: 'Passionate about React, Next.js, TypeScript & modern web dev',
      },
      {
        icon: 'palette',
        label: 'UI/UX design, clean architectures and responsive web apps',
      },
      {
        icon: 'desktop_windows',
        label: 'Building scalable web tools, interactive apps and open source',
      },
    ],
  },
  stack: {
    title: 'Tech stack',
    groups: [
      {
        title: 'Main',
        items: [
          {
            icon: 'brand:react',
            label: 'React',
          },
          {
            icon: 'brand:nextdotjs',
            label: 'Next.js',
          },
          {
            icon: 'brand:typescript',
            label: 'TypeScript',
          },
          {
            icon: 'brand:nodedotjs',
            label: 'Node.js',
          },
          {
            icon: 'brand:tailwindcss',
            label: 'Tailwind CSS',
          },
        ],
      },
      {
        title: 'Also',
        items: [
          {
            icon: 'brand:python',
            label: 'Python',
          },
          {
            icon: 'brand:electron',
            label: 'Electron',
          },
          {
            icon: 'code',
            label: 'JavaScript',
          },
          {
            icon: 'brand:archlinux',
            label: 'Linux',
          },
        ],
      },
      {
        title: 'Tools',
        items: [
          {
            icon: 'brand:git',
            label: 'Git',
          },
          {
            icon: 'brand:githubactions',
            label: 'GitHub Actions',
          },
          {
            icon: 'brand:figma',
            label: 'Figma',
          },
          {
            icon: 'brand:discord',
            label: 'Discord',
          },
        ],
      },
    ],
  },
  projects: {
    source: 'pinned',
    repos: [
      'LunarTune',
      'OrionStore',
      'Koda.web',
      'Portfolio',
      'VibeViz',
      'AlexJamesHQ',
    ],
    overrides: {},
    empty: 'No description yet.',
    fork: 'Fork',
  },
  stats: {
    title: 'GitHub activity',
    stars: 'Stars earned',
    contributions: 'Contributions this year',
    repos: 'Public repos',
    followers: 'Followers',
    calendar: 'Last 21 days',
    weekdays: 'SMTWTFS',
    languages: 'Languages across my repositories',
    showLanguages: true,
  },
  streak: {
    title: 'Streak',
    current: 'Current streak',
    longest: 'Longest this year',
    days: 'days',
    currentStreakCount: 14,
    longestStreakCount: 28,
  },
  socials: {
    items: [
      {
        icon: 'brand:facebook',
        url: 'https://www.facebook.com/share/1JAz1nG1c6/',
      },
      {
        icon: 'brand:instagram',
        url: 'https://www.instagram.com/alex.james.dev?exln=dDg5cG5nZTB6aDBx',
      },
      {
        icon: 'brand:whatsapp',
        url: 'https://wa.me/8801977547920',
      },
    ],
    variant: 'chip',
    fill: 'tonal',
    card: true,
  },
  buttons: {
    items: [
      {
        icon: 'language',
        label: 'My website',
        url: 'https://alex-james.vercel.app',
        style: 'filled',
      },
      {
        icon: 'book_2',
        label: 'All repositories',
        url: 'https://github.com/AlexJamesHQ?tab=repositories',
        style: 'tonal',
      },
    ],
  },
};

export const DEFAULT_STATS: StatsData = {
  stars: 24,
  contributions: 873,
  repos: 20,
  followers: 15,
  languages: [
    ['TypeScript', 1240000],
    ['JavaScript', 850000],
    ['React', 620000],
    ['HTML', 450000],
    ['CSS', 380000],
    ['Python', 210000],
    ['Node.js', 180000],
  ],
  days: (statsJson as unknown as StatsData).days,
  pins: [
    {
      name: 'LunarTune',
      url: 'https://github.com/AlexJamesHQ/LunarTune',
      text: 'LunarTune is a modern, privacy-respecting YouTube Music streaming client built for Android with Jetpack Compose and Material 3 design guidelines.',
      fork: false,
      stars: 3,
      language: 'TypeScript',
      topics: ['android', 'youtube-music', 'jetpack-compose', 'material-3', 'music-player'],
    },
    {
      name: 'OrionStore',
      url: 'https://github.com/AlexJamesHQ/OrionStore',
      text: 'A high-performance repository explorer and Android application distribution platform designed with a modern Neobrutalist aesthetic.',
      fork: false,
      stars: 2,
      language: 'TypeScript',
      topics: ['android-store', 'react', 'typescript', 'tailwind', 'neobrutalism'],
    },
    {
      name: 'Koda.web',
      url: 'https://github.com/AlexJamesHQ/Koda.web',
      text: 'A Material 3 Expressive Music and Video app for Android with YT Music Support.',
      fork: false,
      stars: 2,
      language: 'TypeScript',
      topics: ['material-3', 'music-app', 'video-player', 'youtube-music'],
    },
    {
      name: 'Portfolio',
      url: 'https://github.com/AlexJamesHQ/Portfolio',
      text: 'A personal portfolio and creative engineering showcase built with React 19, TypeScript, Tailwind CSS v4, GSAP, Motion, and WebGL.',
      fork: false,
      stars: 1,
      language: 'TypeScript',
      topics: ['portfolio', 'react19', 'typescript', 'tailwind', 'webgl'],
    },
    {
      name: 'VibeViz',
      url: 'https://github.com/AlexJamesHQ/VibeViz',
      text: 'High-performance web app with React, TypeScript, MediaPipe Vision, and Tailwind CSS. Features 52-point facial emotion tracking and gesture recognition.',
      fork: false,
      stars: 1,
      language: 'TypeScript',
      topics: ['computer-vision', 'mediapipe', 'react', 'typescript', 'ai'],
    },
    {
      name: 'AlexJamesHQ',
      url: 'https://github.com/AlexJamesHQ/AlexJamesHQ',
      text: 'ΛLΞX JΛMΞS ᗪEV | C#, Python, JS & .NET Developer Creating immersive web, mobile, and 3D experiences.',
      fork: false,
      stars: 1,
      language: 'TypeScript',
      topics: ['github-profile', 'readme', 'material-3', 'alex-james'],
    },
  ],
  avatar: 'alexjames',
};

export const DEFAULT_PALETTE = paletteJson as unknown as PaletteData;
export const ICONS = iconsJson as unknown as IconsData;

export const PRESET_SEEDS = [
  { name: 'Berry (Default)', hex: '#FF5CA8' },
  { name: 'Indigo Dream', hex: '#6366F1' },
  { name: 'Emerald Forest', hex: '#10B981' },
  { name: 'Ocean Cyan', hex: '#06B6D4' },
  { name: 'Amber Sunset', hex: '#F59E0B' },
  { name: 'Violet Royale', hex: '#8B5CF6' },
  { name: 'Crimson Flame', hex: '#EF4444' },
  { name: 'Slate Monochrome', hex: '#64748B' },
];
