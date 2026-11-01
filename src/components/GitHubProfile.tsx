import React, { useState, useMemo } from 'react';
import { DEFAULT_PROFILE, DEFAULT_STATS, DEFAULT_PALETTE } from '../data/defaultData';
import {
  generateHeroSvg,
  generateAboutSvg,
  generateStackSvg,
  generateProjectCardSvg,
  generateStatsSvg,
  generateStreakSvg,
  generateWaveSvg,
  generateButtonSvg,
  generateSocialPillSvg,
  generateReadmeMarkdown,
} from '../utils/svgBuilder';
import {
  BookOpen,
  FolderGit2,
  LayoutGrid,
  Box,
  Star,
  Users,
  MapPin,
  Link as LinkIcon,
  BookMarked,
  Check,
  Copy,
  Download,
  Code,
  Circle,
  GitFork,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const GitHubProfile: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showRawModal, setShowRawModal] = useState(false);

  const profile = DEFAULT_PROFILE;
  const stats = DEFAULT_STATS;
  const palette = DEFAULT_PALETTE.dark; // Pure GitHub dark mode palette

  // Generate SVG cards
  const heroSvg = useMemo(() => generateHeroSvg(profile, palette), [profile, palette]);
  const aboutSvg = useMemo(() => generateAboutSvg(profile, palette), [profile, palette]);
  const stackSvg = useMemo(() => generateStackSvg(profile, palette), [profile, palette]);
  const statsSvg = useMemo(() => generateStatsSvg(profile, stats, palette), [profile, stats, palette]);
  const streakSvg = useMemo(() => generateStreakSvg(profile, stats, palette), [profile, stats, palette]);
  const waveSvg = useMemo(() => generateWaveSvg(palette, true), [palette]);

  const projectSvgs = useMemo(() => {
    return stats.pins.map((pin, i) => ({
      pin,
      svg: generateProjectCardSvg(pin, i, palette, true),
    }));
  }, [stats.pins, palette]);

  const buttonSvgs = useMemo(() => {
    return profile.buttons.items.map((b) => ({
      button: b,
      svg: generateButtonSvg(b.label, b.icon, b.style, palette, true),
    }));
  }, [profile.buttons.items, palette]);

  const socialSvgs = useMemo(() => {
    return profile.socials.items.map((s) => {
      const brand = s.icon.replace('brand:', '');
      const label = brand.charAt(0).toUpperCase() + brand.slice(1);
      return {
        item: s,
        label,
        svg: generateSocialPillSvg(label, s.icon, palette, true),
      };
    });
  }, [profile.socials.items, palette]);

  const readmeMarkdown = useMemo(() => {
    return generateReadmeMarkdown(profile, stats.pins);
  }, [profile, stats.pins]);

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-[#ffb0cd]/20 selection:text-[#ffb0cd]">
      {/* GitHub Top Navigation Bar (Responsive for Mobile & Desktop) */}
      <header className="w-full bg-[#161b22] border-b border-[#30363d] px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://github.com/AlexJamesHQ"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:opacity-80 transition"
          >
            <svg height="32" viewBox="0 0 16 16" width="32" className="fill-current text-white">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
          <span className="font-semibold text-sm text-white hidden sm:inline">AlexJamesHQ</span>
        </div>

        {/* Quick action: Copy README for GitHub Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#238636] hover:bg-[#2ea043] text-white shadow-sm transition active:scale-95"
            title="Copy ready-to-use README.md markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy README.md'}</span>
          </button>

          <button
            onClick={() => setShowRawModal(true)}
            className="p-1.5 rounded-md text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d] transition"
            title="View Raw Markdown"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* GitHub Tabs Sub-header */}
      <div className="w-full bg-[#0d1117] border-b border-[#30363d] px-4 sm:px-8 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm overflow-x-auto">
        <div className="flex items-center gap-2 py-3 border-b-2 border-[#fd8c73] font-semibold text-white">
          <BookOpen className="w-4 h-4 text-[#7d8590]" />
          <span>Overview</span>
        </div>

        <div className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#7d8590] hover:text-[#e6edf3] transition cursor-pointer">
          <FolderGit2 className="w-4 h-4" />
          <span>Repositories</span>
          <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-[#21262d] text-[#e6edf3]">
            {stats.repos}
          </span>
        </div>

        <div className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#7d8590] hover:text-[#e6edf3] transition cursor-pointer hidden md:flex">
          <LayoutGrid className="w-4 h-4" />
          <span>Projects</span>
        </div>

        <div className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#7d8590] hover:text-[#e6edf3] transition cursor-pointer hidden lg:flex">
          <Box className="w-4 h-4" />
          <span>Packages</span>
        </div>

        <div className="flex items-center gap-2 py-3 border-b-2 border-transparent text-[#7d8590] hover:text-[#e6edf3] transition cursor-pointer">
          <Star className="w-4 h-4" />
          <span>Stars</span>
          <span className="px-1.5 py-0.5 rounded-full text-[11px] font-mono bg-[#21262d] text-[#e6edf3]">
            {stats.stars}
          </span>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left Sidebar: User Profile Information */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
            {/* Avatar */}
            <div className="relative mb-0 md:mb-4">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#30363d] shadow-md bg-[#161b22]">
                <img
                  src={profile.hero.avatarUrl}
                  alt="Alex James"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Names & Handle */}
            <div className="flex-1 md:flex-none">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {profile.hero.name}
              </h1>
              <p className="text-base sm:text-lg font-light text-[#7d8590] leading-snug">
                {profile.login}
              </p>
            </div>
          </div>

          {/* Bio Subtitle */}
          <p className="mt-3 text-xs sm:text-sm text-[#e6edf3] leading-relaxed whitespace-pre-line">
            {profile.hero.subtitle.split('\n')[0]}
          </p>

          {/* Follow Button */}
          <button className="w-full mt-3 sm:mt-4 py-1.5 px-3 rounded-md font-semibold text-xs sm:text-sm border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] shadow-sm transition">
            Follow
          </button>

          {/* Follower Stats */}
          <div className="mt-4 flex items-center gap-3 text-xs text-[#7d8590]">
            <div className="flex items-center gap-1 hover:text-[#2f81f7] cursor-pointer">
              <Users className="w-3.5 h-3.5" />
              <strong className="text-[#e6edf3]">{stats.followers}</strong> followers
            </div>
            <span>·</span>
            <div className="hover:text-[#2f81f7] cursor-pointer">
              <strong className="text-[#e6edf3]">14</strong> following
            </div>
          </div>

          {/* Location & Links */}
          <div className="mt-4 pt-4 border-t border-[#30363d] space-y-2 text-xs text-[#7d8590]">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Bangladesh</span>
            </div>

            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 shrink-0" />
              <a
                href="https://alex-james.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-[#2f81f7] hover:underline truncate"
              >
                https://alex-james.vercel.app
              </a>
            </div>

            {/* Direct Social Links */}
            <div className="pt-2 flex items-center gap-3 text-xs">
              <a
                href="https://www.facebook.com/share/1JAz1nG1c6/"
                target="_blank"
                rel="noreferrer"
                className="text-[#7d8590] hover:text-[#2f81f7] transition"
                title="Facebook Profile"
              >
                Facebook
              </a>
              <span>·</span>
              <a
                href="https://www.instagram.com/alex.james.dev?exln=dDg5cG5nZTB6aDBx"
                target="_blank"
                rel="noreferrer"
                className="text-[#7d8590] hover:text-[#ffb0cd] transition"
                title="Instagram Profile"
              >
                Instagram
              </a>
              <span>·</span>
              <a
                href="https://wa.me/8801977547920"
                target="_blank"
                rel="noreferrer"
                className="text-[#7d8590] hover:text-emerald-400 transition"
                title="WhatsApp (01977547920)"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </aside>

        {/* Right Main Column: Authentic GitHub README.md Container */}
        <main className="flex-1 min-w-0">
          {/* Subtitle path */}
          <div className="text-xs mb-2 flex items-center justify-between text-[#7d8590]">
            <div className="flex items-center gap-1 font-mono">
              <span className="font-semibold text-[#e6edf3]">{profile.login}</span>
              <span>/</span>
              <span>README.md</span>
            </div>
          </div>

          {/* GitHub README Box */}
          <div className="w-full rounded-md border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-sm mb-8">
            {/* README Box Header */}
            <div className="px-4 py-2 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs text-[#7d8590]">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#7d8590]" />
                <span className="font-mono text-[#e6edf3] font-medium">{profile.login} / README.md</span>
              </div>

              <button
                onClick={handleCopyReadme}
                className="flex items-center gap-1 text-[11px] text-[#7d8590] hover:text-[#e6edf3] transition"
                title="Copy markdown code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* README Content: The Live Material 3 Profile */}
            <div className="p-3 sm:p-6 overflow-hidden">
              <div className="max-w-[840px] mx-auto flex flex-col items-center">
                {/* 1. Hero Card */}
                <div className="w-full mb-4 sm:mb-6 rounded-[24px] sm:rounded-[32px] overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: heroSvg }}
                    className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 2. Social Media Badges (Facebook, Instagram, WhatsApp) */}
                <div className="w-full mb-4 sm:mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
                  {socialSvgs.map(({ item, svg, label }, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="transform transition hover:-translate-y-0.5 hover:shadow-lg rounded-[24px] overflow-hidden active:scale-95"
                      title={`${label}: ${item.url}`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: svg }} />
                    </a>
                  ))}
                </div>

                {/* 3. About Me */}
                <div className="w-full mb-4 sm:mb-6 rounded-[24px] sm:rounded-[32px] overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: aboutSvg }}
                    className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 4. Tech Stack */}
                <div className="w-full mb-4 sm:mb-6 rounded-[24px] sm:rounded-[32px] overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: stackSvg }}
                    className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 5. Pinned Projects Grid */}
                <div className="w-full mb-4 sm:mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {projectSvgs.map(({ pin, svg }) => (
                      <div
                        key={pin.name}
                        className="w-full rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        <a
                          href={pin.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block w-full"
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: svg }}
                            className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. GitHub Activity Stats */}
                <div className="w-full mb-4 sm:mb-6 rounded-[24px] sm:rounded-[32px] overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: statsSvg }}
                    className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 7. Streak */}
                <div className="w-full mb-4 sm:mb-6 rounded-[24px] sm:rounded-[32px] overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: streakSvg }}
                    className="w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 8. Wave Divider */}
                <div className="w-full my-4 flex justify-center overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: waveSvg }}
                    className="w-full [&>svg]:w-full [&>svg]:h-auto"
                  />
                </div>

                {/* 9. Action Buttons */}
                <div className="w-full my-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {buttonSvgs.map(({ button, svg }, i) => (
                    <a
                      key={i}
                      href={button.url}
                      target="_blank"
                      rel="noreferrer"
                      className="transform transition hover:-translate-y-0.5 hover:shadow-md rounded-[28px] overflow-hidden active:scale-95"
                    >
                      <div dangerouslySetInnerHTML={{ __html: svg }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Repositories List Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-3 text-white">
              Pinned Repositories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats.pins.slice(0, 4).map((pin) => (
                <div
                  key={pin.name}
                  className="p-3.5 rounded-md border border-[#30363d] bg-[#0d1117] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <a
                        href={pin.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#2f81f7] hover:underline flex items-center gap-1.5 text-xs sm:text-sm"
                      >
                        <BookMarked className="w-3.5 h-3.5 text-[#7d8590]" />
                        <span>{pin.name}</span>
                      </a>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full border border-[#30363d] text-[#7d8590] font-mono">
                        Public
                      </span>
                    </div>
                    <p className="text-xs text-[#7d8590] line-clamp-2 mb-3">
                      {pin.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#7d8590]">
                    {pin.language && (
                      <div className="flex items-center gap-1.5">
                        <Circle className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                        <span>{pin.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      <span>{pin.stars}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Bottom Toast/Action Bar for 1-Click Copy */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={handleCopyReadme}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs shadow-xl transition-transform active:scale-95"
          title="Copy README.md markdown"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied README!' : 'Copy README.md'}</span>
        </button>

        <button
          onClick={handleDownloadReadme}
          className="p-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] shadow-xl transition"
          title="Download README.md file"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Raw Markdown Modal */}
      {showRawModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between text-xs font-semibold">
              <span className="text-white font-mono">README.md Markdown Code</span>
              <button
                onClick={() => setShowRawModal(false)}
                className="text-[#7d8590] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-[#7d8590] bg-[#0d1117] leading-relaxed">
              <pre className="whitespace-pre-wrap">{readmeMarkdown}</pre>
            </div>
            <div className="p-3 border-t border-[#30363d] flex justify-end gap-2 bg-[#161b22]">
              <button
                onClick={() => setShowRawModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#7d8590] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopyReadme();
                  setShowRawModal(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#238636] hover:bg-[#2ea043] text-white font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
