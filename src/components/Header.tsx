import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Sliders,
  FileCode,
  Palette,
  RotateCcw,
  Check,
  Copy,
  Layers,
  Smartphone,
} from 'lucide-react';
import { PRESET_SEEDS } from '../data/defaultData';

interface HeaderProps {
  activeTab: 'preview' | 'github' | 'editor' | 'export';
  setActiveTab: (tab: 'preview' | 'github' | 'editor' | 'export') => void;
  theme: 'light' | 'dark';
  isAutoTheme: boolean;
  onToggleThemeMode: () => void;
  seedColor: string;
  onSeedChange: (hex: string) => void;
  onReset: () => void;
  onQuickCopyReadme: () => void;
  copiedReadme: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  isAutoTheme,
  onToggleThemeMode,
  seedColor,
  onSeedChange,
  onReset,
  onQuickCopyReadme,
  copiedReadme,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b ${
        isDark
          ? 'bg-[#0d1117]/95 border-[#30363d] text-white'
          : 'bg-white/95 border-[#d0d7de] text-[#1f2328]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform hover:rotate-12 duration-300"
            style={{ backgroundColor: seedColor }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-sm sm:text-base tracking-tight truncate">
                Alex James
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono border hidden xs:inline ${
                  isDark
                    ? 'bg-[#161b22] border-[#30363d] text-neutral-300'
                    : 'bg-[#f6f8fa] border-[#d0d7de] text-neutral-600'
                }`}
              >
                README
              </span>
            </div>
            <p className="text-[11px] opacity-60 hidden md:block">
              github.com/AlexJamesHQ
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav
          className={`flex items-center p-1 rounded-xl border text-xs ${
            isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'
          }`}
        >
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'preview'
                ? isDark
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'bg-white text-[#1f2328] shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            title="Profile View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'github'
                ? isDark
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'bg-white text-[#1f2328] shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            title="GitHub Page View"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'editor'
                ? isDark
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'bg-white text-[#1f2328] shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            title="Customizer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'export'
                ? isDark
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'bg-white text-[#1f2328] shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            title="Export README Markdown & SVGs"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">README</span>
          </button>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Seed Color Palette Popover */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
                isDark
                  ? 'bg-[#161b22] border-[#30363d] text-neutral-200'
                  : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
              }`}
              title="Material 3 Seed Color"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{ backgroundColor: seedColor }}
              />
              <Palette className="w-3.5 h-3.5 opacity-60" />
            </button>

            {showColorPicker && (
              <div
                className={`absolute right-0 mt-2 w-64 p-3 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                  isDark
                    ? 'bg-[#161b22] border-[#30363d] text-white'
                    : 'bg-white border-[#d0d7de] text-[#1f2328]'
                }`}
              >
                <div className="text-xs font-semibold mb-2">Preset Seed Colors</div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_SEEDS.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => {
                        onSeedChange(preset.hex);
                        setShowColorPicker(false);
                      }}
                      className={`group relative flex flex-col items-center p-1.5 rounded-xl transition ${
                        isDark ? 'hover:bg-[#21262d]' : 'hover:bg-neutral-100'
                      }`}
                      title={preset.name}
                    >
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center border border-white/20 shadow-sm"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {seedColor.toLowerCase() === preset.hex.toLowerCase() && (
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </div>
                      <span className="text-[10px] opacity-70 mt-1 truncate max-w-full">
                        {preset.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <div
                  className={`pt-2 border-t ${
                    isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'
                  }`}
                >
                  <label className="text-[11px] opacity-70 mb-1 block">Custom Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={seedColor}
                      onChange={(e) => onSeedChange(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={seedColor}
                      onChange={(e) => onSeedChange(e.target.value)}
                      className={`flex-1 px-2 py-1 text-xs border rounded-lg font-mono ${
                        isDark
                          ? 'bg-[#0d1117] border-[#30363d] text-white'
                          : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Mode Toggle (Auto Phone / Dark / Light) */}
          <button
            onClick={onToggleThemeMode}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'bg-[#161b22] border-[#30363d] text-neutral-200'
                : 'bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]'
            }`}
            title={
              isAutoTheme
                ? `Theme: Auto (Phone Sync: ${theme.toUpperCase()}) - Click to toggle`
                : `Theme: Manual ${theme.toUpperCase()} - Click to toggle`
            }
          >
            {isAutoTheme ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-pink-500" />
                <span className="text-[11px] font-semibold text-pink-500 hidden sm:inline">
                  Auto
                </span>
              </>
            ) : theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </button>

          {/* Quick Copy README */}
          <button
            onClick={onQuickCopyReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-600 hover:bg-pink-500 text-white transition shadow-sm"
            title="Copy ready-to-use README.md markdown"
          >
            {copiedReadme ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden xs:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Copy README</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className={`p-1.5 sm:p-2 rounded-lg transition opacity-60 hover:opacity-100 ${
              isDark ? 'hover:bg-[#21262d]' : 'hover:bg-neutral-100'
            }`}
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
