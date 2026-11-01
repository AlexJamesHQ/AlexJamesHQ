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
      {/* Pure, Clean Profile - ZERO headers, ZERO banners, ZERO footers */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <ProfileViewer
          profile={profile}
          stats={stats}
          palette={currentPalette}
          theme={theme}
        />
      </main>

      {/* Discrete Floating Controls (Theme Toggle & Copy README) */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/60 p-1.5 rounded-full shadow-2xl">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-300" />
          )}
        </button>

        <button
          onClick={handleQuickCopyReadme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-600 hover:bg-pink-500 text-white transition shadow-sm"
          title="Copy ready-to-use README.md markdown"
        >
          {copiedReadme ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy README</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default App;
