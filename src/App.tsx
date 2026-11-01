import React, { useState, useMemo, useEffect } from 'react';
import { ProfileConfig, StatsData } from './types';
import { DEFAULT_PROFILE, DEFAULT_STATS } from './data/defaultData';
import { generateMaterial3Palette } from './utils/colorUtils';
import { generateReadmeMarkdown } from './utils/svgBuilder';
import { ProfileViewer } from './components/ProfileViewer';
import { Sun, Moon, Copy, Check } from 'lucide-react';

export const App: React.FC = () => {
  const [profile] = useState<ProfileConfig>(DEFAULT_PROFILE);
  const [stats] = useState<StatsData>(DEFAULT_STATS);

  // Auto detect phone/system dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Listen for device/phone system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateFromSystem = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    try {
      mediaQuery.addEventListener('change', updateFromSystem);
      return () => mediaQuery.removeEventListener('change', updateFromSystem);
    } catch {
      mediaQuery.addListener(updateFromSystem);
      return () => mediaQuery.removeListener(updateFromSystem);
    }
  }, []);

  const [copiedReadme, setCopiedReadme] = useState(false);

  // Compute Material 3 Palettes from seed color
  const paletteData = useMemo(() => {
    return generateMaterial3Palette(profile.seed || '#FF5CA8');
  }, [profile.seed]);

  const currentPalette = paletteData[theme];

  // Quick copy README markdown
  const handleQuickCopyReadme = () => {
    const md = generateReadmeMarkdown(profile, stats.pins);
    navigator.clipboard.writeText(md);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 selection:bg-pink-500/30 selection:text-pink-200 ${
        isDark ? 'bg-[#0d1117] text-neutral-100' : 'bg-[#f6f8fa] text-[#1f2328]'
      }`}
    >
      {/* Pure, Clean Profile - ZERO headers, ZERO banners, ZERO footers, ZERO floating buttons */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <ProfileViewer
          profile={profile}
          stats={stats}
          palette={currentPalette}
          theme={theme}
        />
      </main>
    </div>
  );
};
export default App;
