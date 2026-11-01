import React, { useMemo, useState } from 'react';
import {
  ProfileConfig,
  StatsData,
  PaletteTheme,
} from '../types';
import {
  generateHeroSvg,
  generateAboutSvg,
  generateStackSvg,
  generateProjectCardSvg,
  generateStatsSvg,
  generateStreakSvg,
  generateWaveSvg,
  generateButtonSvg,
  generateCreditSvg,
  generateSocialPillSvg,
} from '../utils/svgBuilder';
import { Download, Copy, Check, ExternalLink, Code } from 'lucide-react';

interface ProfileViewerProps {
  profile: ProfileConfig;
  stats: StatsData;
  palette: PaletteTheme;
  theme: 'light' | 'dark';
}

export const ProfileViewer: React.FC<ProfileViewerProps> = ({
  profile,
  stats,
  palette,
  theme,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute live SVGs
  const heroSvg = useMemo(() => generateHeroSvg(profile, palette), [profile, palette]);
  const aboutSvg = useMemo(() => generateAboutSvg(profile, palette), [profile, palette]);
  const stackSvg = useMemo(() => generateStackSvg(profile, palette), [profile, palette]);
  const statsSvg = useMemo(() => generateStatsSvg(profile, stats, palette), [profile, stats, palette]);
  const streakSvg = useMemo(() => generateStreakSvg(profile, stats, palette), [profile, stats, palette]);
  const waveSvg = useMemo(() => generateWaveSvg(palette, profile.motion), [palette, profile.motion]);
  const creditSvg = useMemo(() => generateCreditSvg(palette, profile.motion), [palette, profile.motion]);

  const projectSvgs = useMemo(() => {
    return stats.pins.map((pin, i) => ({
      pin,
      svg: generateProjectCardSvg(pin, i, palette, profile.motion),
    }));
  }, [stats.pins, palette, profile.motion]);

  const buttonSvgs = useMemo(() => {
    return profile.buttons.items.map((b) => ({
      button: b,
      svg: generateButtonSvg(b.label, b.icon, b.style, palette, profile.motion),
    }));
  }, [profile.buttons.items, palette, profile.motion]);

  const copySvgText = (id: string, svgContent: string) => {
    navigator.clipboard.writeText(svgContent);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadSvgFile = (filename: string, svgContent: string) => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderSectionWidget = (key: string) => {
    if (profile.hidden.includes(key)) return null;

    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="group relative w-full mb-6 transition-transform">
            <div className="overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition">
              <div dangerouslySetInnerHTML={{ __html: heroSvg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
            </div>
            {/* Quick Actions overlay on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
              <button
                onClick={() => copySvgText('hero', heroSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg flex items-center gap-1"
                title="Copy SVG markup"
              >
                {copiedId === 'hero' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">SVG</span>
              </button>
              <button
                onClick={() => downloadSvgFile(`hero-${theme}.svg`, heroSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                title="Download SVG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'socials':
        return (
          <div key="socials" className="w-full mb-6 flex flex-wrap items-center justify-center gap-3">
            {profile.socials.items.map((soc, i) => {
              const brand = soc.icon.replace('brand:', '');
              const label = brand.charAt(0).toUpperCase() + brand.slice(1);
              const pillSvg = generateSocialPillSvg(label, soc.icon, palette, profile.motion);
              return (
                <a
                  key={i}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="transform transition hover:-translate-y-0.5 hover:shadow-lg rounded-[24px] overflow-hidden"
                  title={`${label}: ${soc.url}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: pillSvg }} />
                </a>
              );
            })}
          </div>
        );

      case 'about':
        return (
          <div key="about" className="group relative w-full mb-6">
            <div className="overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition">
              <div dangerouslySetInnerHTML={{ __html: aboutSvg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
              <button
                onClick={() => copySvgText('about', aboutSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg flex items-center gap-1"
                title="Copy SVG"
              >
                {copiedId === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">SVG</span>
              </button>
              <button
                onClick={() => downloadSvgFile(`about-${theme}.svg`, aboutSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                title="Download SVG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'stack':
        return (
          <div key="stack" className="group relative w-full mb-6">
            <div className="overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition">
              <div dangerouslySetInnerHTML={{ __html: stackSvg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
              <button
                onClick={() => copySvgText('stack', stackSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg flex items-center gap-1"
                title="Copy SVG"
              >
                {copiedId === 'stack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">SVG</span>
              </button>
              <button
                onClick={() => downloadSvgFile(`stack-${theme}.svg`, stackSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                title="Download SVG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div key="projects" className="w-full mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectSvgs.map(({ pin, svg }, idx) => (
                <div key={pin.name} className="group relative overflow-hidden rounded-[28px] shadow-sm hover:shadow-md transition">
                  <a
                    href={pin.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full"
                  >
                    <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
                  </a>
                  <div className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copySvgText(`proj-${idx}`, svg);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Copy SVG"
                    >
                      {copiedId === `proj-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        downloadSvgFile(`project-${pin.name.toLowerCase()}-${theme}.svg`, svg);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Download SVG"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div key="stats" className="group relative w-full mb-6">
            <div className="overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition">
              <div dangerouslySetInnerHTML={{ __html: statsSvg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
              <button
                onClick={() => copySvgText('stats', statsSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg flex items-center gap-1"
                title="Copy SVG"
              >
                {copiedId === 'stats' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">SVG</span>
              </button>
              <button
                onClick={() => downloadSvgFile(`stats-${theme}.svg`, statsSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                title="Download SVG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'streak':
        return (
          <div key="streak" className="group relative w-full mb-6">
            <div className="overflow-hidden rounded-[32px] shadow-sm hover:shadow-md transition">
              <div dangerouslySetInnerHTML={{ __html: streakSvg }} className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto" />
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-white text-xs">
              <button
                onClick={() => copySvgText('streak', streakSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg flex items-center gap-1"
                title="Copy SVG"
              >
                {copiedId === 'streak' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">SVG</span>
              </button>
              <button
                onClick={() => downloadSvgFile(`streak-${theme}.svg`, streakSvg)}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                title="Download SVG"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'wave':
        return (
          <div key="wave" className="w-full my-6 flex justify-center overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: waveSvg }} className="w-full [&>svg]:w-full [&>svg]:h-auto" />
          </div>
        );

      case 'buttons':
        return (
          <div key="buttons" className="w-full my-6 flex flex-wrap items-center justify-center gap-4">
            {buttonSvgs.map(({ button, svg }, i) => (
              <a
                key={i}
                href={button.url}
                target="_blank"
                rel="noreferrer"
                className="transform transition hover:-translate-y-0.5 hover:shadow-lg rounded-[28px] overflow-hidden"
              >
                <div dangerouslySetInnerHTML={{ __html: svg }} />
              </a>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff',
        borderRadius: '24px',
        border: theme === 'dark' ? '1px solid #30363d' : '1px solid #e1e4e8',
      }}
    >
      <div className="flex flex-col items-center">
        {profile.order.map((sectionKey) => renderSectionWidget(sectionKey))}

      </div>
    </div>
  );
};
