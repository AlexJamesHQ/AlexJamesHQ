import { PaletteTheme, ProfileConfig, StatsData, PinnedRepo } from '../types';
import { generateShapePath, generateWavePath } from './shapes';
import { mix } from './colorUtils';
import { ICONS } from '../data/defaultData';
import metricsJson from '../data/metrics.json';

const METRICS = metricsJson as Record<string, Record<string, number>>;
const W = 840;

const SHAPES = ['cookie', 'clover', 'sunny', 'flower'] as const;

const ICON_RULES: [string[], string][] = [
  [['zip', 'archive', '7-zip', 'rar'], 'folder_zip'],
  [['music', 'audio', 'spotify', 'player', 'sound'], 'music_note'],
  [['dictat', 'speech', 'voice', 'whisper', 'mic'], 'mic'],
  [['tracker', 'screen time', 'activity', 'monitor', 'stats'], 'monitoring'],
  [['discord'], 'brand:discord'],
  [['game', 'minecraft', 'mod '], 'sports_esports'],
  [['site', 'website', 'web ', 'landing', 'portfolio'], 'language'],
  [['launcher', 'installer'], 'deployed_code'],
  [['theme', 'design', 'ui kit', 'palette'], 'palette'],
  [['terminal', 'cli', 'shell', 'dotfiles', 'hyprland'], 'terminal'],
];

const LANG_ICONS: Record<string, string> = {
  Rust: 'brand:rust',
  Python: 'brand:python',
  TypeScript: 'brand:typescript',
  JavaScript: 'code',
  'C#': 'desktop_windows',
  Java: 'brand:openjdk',
};

export function textWidth(s: string, size: number, weight = 400): number {
  const weights = [400, 500, 600, 700];
  const closest = weights.reduce((prev, curr) =>
    Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
  );
  const table = METRICS[String(closest)] || {};
  let total = 0;
  for (const c of s) {
    total += table[c] ?? 0.55;
  }
  return total * size;
}

export function wrapText(s: string, size: number, maxWidth: number, weight = 400, maxLines = 2): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let cur = '';

  for (const word of words) {
    const trial = cur ? `${cur} ${word}` : word;
    if (textWidth(trial, size, weight) <= maxWidth) {
      cur = trial;
    } else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);

  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    while (textWidth(trimmed[trimmed.length - 1] + '…', size, weight) > maxWidth) {
      const parts = trimmed[trimmed.length - 1].split(' ');
      if (parts.length <= 1) break;
      parts.pop();
      trimmed[trimmed.length - 1] = parts.join(' ');
    }
    trimmed[trimmed.length - 1] += '…';
    return trimmed;
  }
  return lines;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function renderIcon(name: string, x: number, y: number, size: number, fill: string): string {
  if (name.startsWith('brand:')) {
    const brandName = name.slice(6);
    const d = ICONS.brand[brandName] || ICONS.brand.react || '';
    const s = size / 24;
    return `<path d="${d}" fill="${fill}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)})"/>`;
  }
  const sym = ICONS.symbol[name] || ICONS.symbol.code;
  if (!sym) return '';
  const [vx, vy, vw] = sym.vb.split(' ').map(Number);
  const s = size / vw;
  return `<path d="${sym.d}" fill="${fill}" transform="translate(${(x - vx * s).toFixed(1)} ${(y - vy * s).toFixed(1)}) scale(${s.toFixed(4)})"/>`;
}

export function renderText(
  x: number,
  y: number,
  s: string,
  size: number,
  fill: string,
  weight = 400,
  cls = '',
  delay: number | null = null,
  anchor = 'start',
  extra = ''
): string {
  let style = `font-size:${size}px;font-weight:${weight};`;
  if (delay !== null) {
    style += `animation-delay:${delay.toFixed(2)}s;`;
  }
  const c = cls ? ` class="${cls}"` : '';
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${fill}" text-anchor="${anchor}" style="${style}"${c}${extra}>${escapeHtml(s)}</text>`;
}

export function wrapSvg(w: number, h: number, body: string, title: string, motion = true): string {
  const motionCss = motion
    ? `
.up{animation:up .8s cubic-bezier(.05,.7,.1,1) both}
.pop{transform-box:fill-box;transform-origin:center;animation:pop .6s cubic-bezier(.34,1.56,.64,1) both}
.fade{animation:fade .9s ease both}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
.spin-r{transform-box:fill-box;transform-origin:center;animation:spin 28s linear infinite reverse}
.bob{transform-box:fill-box;transform-origin:center;animation:bob 7s ease-in-out infinite}
.breathe{transform-box:fill-box;transform-origin:center;animation:breathe 6s ease-in-out infinite}
.grow{transform-box:fill-box;transform-origin:left center;animation:grow 1.1s cubic-bezier(.2,0,0,1) both}
.wght{animation:wght 1.6s cubic-bezier(.2,0,0,1) .2s both}
.wave{animation:wave 2.4s linear infinite}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(12deg)}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes wght{from{font-variation-settings:'ROND' 100,'wght' 400}to{font-variation-settings:'ROND' 100,'wght' 760}}
@keyframes wave{from{transform:translateX(0)}to{transform:translateX(-48px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`
    : `* { animation: none !important; }`;

  const css = `
text{font-family:'Google Sans Flex','Google Sans',Roboto,'Segoe UI',sans-serif;font-variation-settings:'ROND' 100}
${motionCss}
`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(title)}"><title>${escapeHtml(title)}</title><style>${css}</style>${body}</svg>`;
}

export function renderChip(
  x: number,
  y: number,
  label: string,
  p: PaletteTheme,
  ic?: string,
  delay = 0,
  h = 36,
  size = 15,
  style = 'outlined'
): { element: string; width: number } {
  const pad = 14;
  const iw = ic ? 18 : 0;
  const gap = ic ? 8 : 0;
  const w = pad * 2 + iw + gap + textWidth(label, size, 500);

  let bg: string;
  let fg: string;
  if (style === 'tonal') {
    bg = `<rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="10" fill="${p.secondaryContainer}"/>`;
    fg = p.onSecondaryContainer;
  } else {
    bg = `<rect x="${(x + 0.5).toFixed(1)}" y="${(y + 0.5).toFixed(1)}" width="${(w - 1).toFixed(1)}" height="${h - 1}" rx="10" fill="${p.surfaceContainerLow}" stroke="${p.outlineVariant}"/>`;
    fg = p.onSurfaceVariant;
  }

  const parts = [bg];
  if (ic) {
    parts.push(renderIcon(ic, x + pad, y + (h - 18) / 2, 18, p.primary));
  }
  parts.push(renderText(x + pad + iw + gap, y + h / 2 + size * 0.36, label, size, fg, 500));

  return {
    element: `<g class="pop" style="animation-delay:${delay.toFixed(2)}s">${parts.join('')}</g>`,
    width: w,
  };
}

export function renderSectionTitle(
  x: number,
  y: number,
  label: string,
  ic: string,
  p: PaletteTheme,
  delay = 0
): string {
  const tile = `<path class="pop" style="animation-delay:${delay.toFixed(2)}s" d="${generateShapePath('cookie', x + 20, y + 20, 20)}" fill="${p.primaryContainer}"/>`;
  const i = `<g class="pop" style="animation-delay:${(delay + 0.05).toFixed(2)}s">${renderIcon(ic, x + 9, y + 9, 22, p.onPrimaryContainer)}</g>`;
  return tile + i + renderText(x + 54, y + 28, label, 24, p.onSurface, 600, 'up', delay);
}

// 1. Hero SVG
export function generateHeroSvg(profile: ProfileConfig, p: PaletteTheme): string {
  const h = 300;
  const b: string[] = [];
  b.push(`<clipPath id="card"><rect width="${W}" height="${h}" rx="32"/></clipPath>`);
  b.push(`<rect width="${W}" height="${h}" rx="32" fill="${p.surfaceContainer}"/>`);
  b.push('<g clip-path="url(#card)">');
  b.push(`<path class="spin" d="${generateShapePath('flower', 780, 30, 150)}" fill="${p.primaryContainer}"/>`);
  b.push(`<path class="bob" d="${generateShapePath('clover', 690, 292, 62)}" fill="${p.tertiaryContainer}"/>`);
  b.push(`<path class="spin-r" d="${generateShapePath('sunny', 812, 236, 34)}" fill="${p.secondaryContainer}"/>`);
  b.push('</g>');

  const cx = 150;
  const cy = 150;
  b.push(`<path class="spin" d="${generateShapePath('sunny', cx, cy, 112)}" fill="${p.primary}" opacity=".9"/>`);
  b.push(`<clipPath id="ava"><path d="${generateShapePath(profile.hero.avatarShape || 'cookie12', cx, cy, 98)}"/></clipPath>`);
  b.push(`<path d="${generateShapePath(profile.hero.avatarShape || 'cookie12', cx, cy, 102)}" fill="${p.surfaceContainer}"/>`);

  const avatarUrl = profile.hero.avatarUrl || `https://github.com/${profile.login}.png?size=320`;
  b.push(`<g class="fade"><image href="${avatarUrl}" x="${cx - 100}" y="${cy - 100}" width="200" height="200" clip-path="url(#ava)" preserveAspectRatio="xMidYMid slice"/></g>`);

  const x = 294;
  const greeting = profile.hero.greeting || "Hi, I'm";
  const login = profile.hero.name || profile.login;
  b.push(renderText(x, 92, greeting, 22, p.onSurfaceVariant, 500, 'up', 0.1));
  b.push(`<g class="up" style="animation-delay:.2s">${renderText(x - 3, 156, login, 68, p.onSurface, 400, 'wght')}</g>`);

  const subtitleLines = profile.hero.subtitle.split('\n');
  const renderedLines: string[] = [];
  for (const sLine of subtitleLines) {
    const wrapped = wrapText(sLine, 19, 430, 400, 2);
    renderedLines.push(...wrapped);
  }

  renderedLines.slice(0, 2).forEach((line, i) => {
    b.push(renderText(x, 194 + i * 26, line, 19, p.onSurfaceVariant, 400, 'up', 0.35 + i * 0.08));
  });

  let cx2 = x;
  profile.hero.chips.forEach((c, i) => {
    const { element, width } = renderChip(cx2, 236, c.label, p, c.icon, 0.6 + i * 0.1, 36, 15, 'tonal');
    b.push(element);
    cx2 += width + 8;
  });

  return wrapSvg(W, h, b.join(''), `${greeting} ${login}`, profile.motion);
}

// 2. About SVG
export function generateAboutSvg(profile: ProfileConfig, p: PaletteTheme): string {
  const row = 54;
  const items = profile.about.items;
  const h = 92 + row * items.length;
  const b: string[] = [];
  b.push(`<rect width="${W}" height="${h}" rx="32" fill="${p.surfaceContainerLow}"/>`);
  b.push(renderSectionTitle(28, 26, profile.about.title || 'About me', 'favorite', p));

  items.forEach((item, i) => {
    const y = 86 + i * row;
    b.push(`<g class="up" style="animation-delay:${(0.15 + i * 0.1).toFixed(2)}s">`);
    b.push(`<rect x="28" y="${y}" width="${W - 56}" height="${row - 8}" rx="16" fill="${p.surfaceContainerHigh}"/>`);
    b.push(`<circle cx="54" cy="${y + (row - 8) / 2}" r="15" fill="${p.secondaryContainer}"/>`);
    b.push(renderIcon(item.icon, 45, y + (row - 8) / 2 - 9, 18, p.onSecondaryContainer));
    b.push(renderText(82, y + (row - 8) / 2 + 6, item.label, 17, p.onSurface, 500));
    b.push('</g>');
  });

  return wrapSvg(W, h, b.join(''), profile.about.title || 'About me', profile.motion);
}

// 3. Stack SVG
export function generateStackSvg(profile: ProfileConfig, p: PaletteTheme): string {
  const b: string[] = [];
  let y = 86;
  let d = 0.1;
  const groupsElements: string[] = [];

  for (const group of profile.stack.groups) {
    const gy = y;
    groupsElements.push(
      renderText(28, gy + 14, group.title.toUpperCase(), 12, p.onSurfaceVariant, 600, 'fade', d, 'start', ' letter-spacing="1.4"')
    );
    let x = 28;
    let cy = gy + 26;
    for (const item of group.items) {
      const { width: previewW } = renderChip(0, 0, item.label, p, item.icon);
      if (x + previewW > W - 28) {
        x = 28;
        cy += 44;
      }
      const { element, width } = renderChip(x, cy, item.label, p, item.icon, d);
      groupsElements.push(element);
      x += width + 8;
      d += 0.05;
    }
    y = cy + 36 + 22;
  }
  const h = y + 6;
  b.push(`<rect width="${W}" height="${h}" rx="32" fill="${p.surfaceContainerLow}"/>`);
  b.push(renderSectionTitle(28, 26, profile.stack.title || 'Tech stack', 'code', p));
  b.push(...groupsElements);

  return wrapSvg(W, h, b.join(''), profile.stack.title || 'Tech stack', profile.motion);
}

// Helper to pick repo icon
export function pickProjectIcon(pin: PinnedRepo): string {
  const hay = ` ${pin.name} ${pin.text} ${(pin.topics || []).join(' ')} `.toLowerCase().replace(/-/g, ' ');
  for (const [keys, name] of ICON_RULES) {
    if (keys.some((k) => hay.includes(k))) {
      return name;
    }
  }
  return LANG_ICONS[pin.language] || 'code';
}

// 4. Project Card SVG
export function generateProjectCardSvg(
  pin: PinnedRepo,
  index: number,
  p: PaletteTheme,
  motion = true
): string {
  const w = 412;
  const h = 232;
  const d0 = 0.08 * index;
  const shapeKind = SHAPES[index % SHAPES.length];
  const ic = pickProjectIcon(pin);

  const tags: string[] = [];
  if (pin.language) tags.push(pin.language);
  const hay = `${pin.text} ${(pin.topics || []).join(' ')}`.toLowerCase();
  if (hay.includes('winui') && !tags.includes('WinUI 3')) {
    tags.push('WinUI 3');
  }

  const b: string[] = [];
  b.push(`<rect width="${w}" height="${h}" rx="28" fill="${p.surfaceContainerHigh}"/>`);
  b.push(`<g class="pop" style="animation-delay:${d0.toFixed(2)}s"><path class="spin" d="${generateShapePath(shapeKind, 52, 52, 30)}" fill="${p.primaryContainer}"/></g>`);
  b.push(`<g class="pop" style="animation-delay:${(d0 + 0.08).toFixed(2)}s">${renderIcon(ic, 39, 39, 26, p.onPrimaryContainer)}</g>`);
  b.push(`<circle cx="${w - 40}" cy="40" r="18" fill="${p.surfaceContainerHighest}"/>`);
  b.push(renderIcon('arrow_outward', w - 50, 30, 20, p.onSurfaceVariant));

  const tx = 24;
  b.push(renderText(tx, 116, pin.name, 23, p.onSurface, 650, 'up', d0 + 0.1));

  if (pin.fork) {
    const fw = textWidth('Fork', 12, 600) + 18;
    const fx = tx + textWidth(pin.name, 23, 650) + 10;
    b.push(`<g class="pop" style="animation-delay:${(d0 + 0.25).toFixed(2)}s"><rect x="${fx.toFixed(1)}" y="98" width="${fw.toFixed(1)}" height="22" rx="11" fill="${p.tertiaryContainer}"/>`);
    b.push(renderText(fx + fw / 2, 113, 'Fork', 12, p.onTertiaryContainer, 600, '', null, 'middle') + '</g>');
  }

  const descLines = wrapText(pin.text || 'No description yet.', 15, w - 48, 400, 2);
  descLines.forEach((line, i) => {
    b.push(renderText(tx, 142 + i * 21, line, 15, p.onSurfaceVariant, 400, 'up', d0 + 0.18 + i * 0.05));
  });

  let x = tx;
  tags.forEach((tag, i) => {
    const { element, width: cw } = renderChip(x, 184, tag, p, undefined, d0 + 0.3 + i * 0.06, 28, 13, 'tonal');
    b.push(element);
    x += cw + 6;
  });

  if (pin.stars !== undefined && pin.stars !== null) {
    const label = `${pin.stars}`;
    const sw = textWidth(label, 14, 600);
    b.push(`<g class="pop" style="animation-delay:${(d0 + 0.4).toFixed(2)}s">`);
    b.push(renderIcon('star', w - 24 - sw - 22, 188, 19, p.primary));
    b.push(renderText(w - 24, 203, label, 14, p.onSurfaceVariant, 600, '', null, 'end'));
    b.push('</g>');
  }

  return wrapSvg(w, h, b.join(''), pin.name, motion);
}

// 5. GitHub Activity Stats SVG
export function generateStatsSvg(profile: ProfileConfig, stats: StatsData, p: PaletteTheme): string {
  const langs = stats.languages || [];
  const total = langs.reduce((acc, [, v]) => acc + v, 0) || 1;
  const legend: [number, number, string][] = [];
  let lxPos = 28;
  let row = 0;

  for (const [name, v] of langs) {
    const label = `${name} ${(100 * v / total).toFixed(1)}%`.replace('.0%', '%');
    const lw = 15 + textWidth(label, 14, 500) + 18;
    if (lxPos + lw > W - 28) {
      lxPos = 28;
      row += 1;
    }
    legend.push([lxPos, row, label]);
    lxPos += lw;
  }

  const h = 400 + row * 26;
  const b: string[] = [];
  b.push(`<rect width="${W}" height="${h}" rx="32" fill="${p.surfaceContainerLow}"/>`);
  b.push(renderSectionTitle(28, 26, profile.stats.title || 'GitHub activity', 'monitoring', p));

  const tiles = [
    { ic: 'star', val: `${stats.stars}`, label: profile.stats.stars || 'Stars earned', sh: 'cookie' as const },
    { ic: 'commit', val: `${stats.contributions}`, label: profile.stats.contributions || 'Contributions this year', sh: 'clover' as const },
    { ic: 'book_2', val: `${stats.repos}`, label: profile.stats.repos || 'Public repos', sh: 'sunny' as const },
    { ic: 'group', val: `${stats.followers}`, label: profile.stats.followers || 'Followers', sh: 'flower' as const },
  ];

  tiles.forEach((t, i) => {
    const tx = 28 + (i % 2) * 196;
    const ty = 86 + Math.floor(i / 2) * 106;
    const d = 0.1 + i * 0.08;
    b.push(`<g class="up" style="animation-delay:${d.toFixed(2)}s">`);
    b.push(`<rect x="${tx}" y="${ty}" width="184" height="96" rx="24" fill="${p.surfaceContainerHigh}"/>`);
    b.push(`<path d="${generateShapePath(t.sh, tx + 34, ty + 34, 18)}" fill="${p.primaryContainer}"/>`);
    b.push(renderIcon(t.ic, tx + 24, ty + 24, 20, p.onPrimaryContainer));
    b.push(renderText(tx + 62, ty + 46, t.val, 30, p.onSurface, 700));
    b.push(renderText(tx + 20, ty + 78, t.label, 14, p.onSurfaceVariant, 500));
    b.push('</g>');
  });

  const rx = 432;
  b.push(renderText(rx, 100, profile.stats.calendar || 'Last 21 days', 14, p.onSurfaceVariant, 600, 'fade', 0.1));

  const gap = 6;
  const cw = (W - 28 - rx - gap * 6) / 7;
  const ch = 46;
  const weekdays = (profile.stats.weekdays || 'SMTWTFS').split('');
  weekdays.forEach((letter, i) => {
    b.push(renderText(rx + i * (cw + gap) + cw / 2, 124, letter, 12, p.onSurfaceVariant, 600, 'fade', 0.15, 'middle'));
  });

  const base = p.surfaceContainerHighest;
  const levels = [
    base,
    mix(base, p.primary, 0.4),
    mix(base, p.primary, 0.65),
    mix(base, p.primary, 0.85),
    p.primary,
  ];

  let maxContrib = 1;
  stats.days.forEach((wk) => {
    wk.forEach((d: any) => {
      if (!d) return;
      const val = typeof d === 'number' ? d : (d.c ?? d.count ?? 0);
      if (val > maxContrib) maxContrib = val;
    });
  });

  stats.days.forEach((wk, wi) => {
    wk.forEach((d: any, di) => {
      const cx = rx + di * (cw + gap);
      const cy = 136 + wi * (ch + 6);
      const delay = 0.2 + (wi * 7 + di) * 0.025;

      if (!d) {
        b.push(`<rect class="pop" style="animation-delay:${delay.toFixed(3)}s" x="${(cx + 0.75).toFixed(1)}" y="${cy + 0.75}" width="${(cw - 1.5).toFixed(1)}" height="${ch - 1.5}" rx="14" fill="none" stroke="${p.outlineVariant}" stroke-width="1.5" stroke-dasharray="4 4"/>`);
        return;
      }

      const count = typeof d === 'number' ? d : (d.c ?? d.count ?? 0);
      const dayLabel = typeof d === 'number' ? '' : (d.day !== undefined ? String(d.day) : '');
      const isToday = typeof d === 'object' && d ? Boolean(d.today) : false;

      const lvl = count === 0 ? 0 : Math.min(4, Math.max(1, Math.round((4 * count) / maxContrib)));
      const fg = lvl >= 3 ? p.onPrimary : p.onSurfaceVariant;
      let cell = `<rect x="${cx.toFixed(1)}" y="${cy}" width="${cw.toFixed(1)}" height="${ch}" rx="14" fill="${levels[lvl]}"/>`;
      if (isToday) {
        cell += `<rect x="${(cx - 3).toFixed(1)}" y="${cy - 3}" width="${(cw + 6).toFixed(1)}" height="${ch + 6}" rx="17" fill="none" stroke="${p.primary}" stroke-width="2"/>`;
      }
      if (dayLabel) {
        cell += renderText(cx + cw / 2, cy + ch / 2 + 5, dayLabel, 14, fg, 600, '', null, 'middle');
      }
      b.push(`<g class="pop" style="animation-delay:${delay.toFixed(3)}s">${cell}</g>`);
    });
  });

  if (profile.stats.showLanguages !== false) {
    const ly = 322;
    b.push(renderText(28, ly, profile.stats.languages || 'Languages across all my repositories', 14, p.onSurfaceVariant, 600, 'fade', 0.3));

    const surf = p.surfaceContainerLow;
    const colors = [
      p.primary,
      p.tertiary,
      p.secondary,
      mix(p.primary, surf, 0.45),
      mix(p.tertiary, surf, 0.45),
      mix(p.secondary, surf, 0.45),
      p.outline,
      p.outlineVariant,
    ];

    const bw = W - 56;
    const gaps = 4 * (langs.length - 1);
    const widths = langs.map(([, v]) => Math.max(8.0, ((bw - gaps) * v) / total));
    const k = (bw - gaps) / (widths.reduce((a, b) => a + b, 0) || 1);

    let sx = 28;
    const segs: string[] = [];
    widths.forEach((sw, i) => {
      segs.push(`<rect x="${sx.toFixed(1)}" y="${ly + 12}" width="${(sw * k).toFixed(1)}" height="14" rx="7" fill="${colors[i % colors.length]}"/>`);
      sx += sw * k + 4;
    });
    b.push(`<g class="grow" style="animation-delay:.4s">${segs.join('')}</g>`);

    legend.forEach(([lx, lrow, label], i) => {
      const ly2 = ly + 50 + lrow * 26;
      b.push(`<g class="fade" style="animation-delay:${(0.6 + i * 0.06).toFixed(2)}s"><circle cx="${lx + 5}" cy="${ly2 - 5}" r="5" fill="${colors[i % colors.length]}"/>`);
      b.push(renderText(lx + 15, ly2, label, 14, p.onSurfaceVariant, 500) + '</g>');
    });
  }

  return wrapSvg(W, h, b.join(''), profile.stats.title || 'GitHub activity', profile.motion);
}

// 6. Streak SVG
export function generateStreakSvg(profile: ProfileConfig, stats: StatsData, p: PaletteTheme): string {
  const h = 180;
  const currentDays = profile.streak.currentStreakCount ?? 12;
  const longestDays = profile.streak.longestStreakCount ?? 23;

  const b: string[] = [];
  b.push(`<rect width="${W}" height="${h}" rx="32" fill="${p.surfaceContainerLow}"/>`);
  b.push(renderSectionTitle(28, 26, profile.streak.title || 'Streak', 'monitoring', p));

  const cardW = (W - 56 - 20) / 2;

  // Current Streak Card
  b.push(`<g class="up" style="animation-delay:0.12s">`);
  b.push(`<rect x="28" y="80" width="${cardW}" height="76" rx="20" fill="${p.surfaceContainerHigh}"/>`);
  b.push(`<path d="${generateShapePath('cookie', 58, 118, 18)}" fill="${p.primaryContainer}"/>`);
  b.push(renderIcon('commit', 48, 108, 20, p.onPrimaryContainer));
  b.push(renderText(88, 116, `${currentDays} ${profile.streak.days || 'days'}`, 24, p.onSurface, 700));
  b.push(renderText(88, 138, profile.streak.current || 'Current streak', 13, p.onSurfaceVariant, 500));
  b.push('</g>');

  // Longest Streak Card
  b.push(`<g class="up" style="animation-delay:0.22s">`);
  b.push(`<rect x="${28 + cardW + 20}" y="80" width="${cardW}" height="76" rx="20" fill="${p.surfaceContainerHigh}"/>`);
  b.push(`<path d="${generateShapePath('flower', 28 + cardW + 50, 118, 18)}" fill="${p.tertiaryContainer}"/>`);
  b.push(renderIcon('star', 28 + cardW + 40, 108, 20, p.onTertiaryContainer));
  b.push(renderText(28 + cardW + 80, 116, `${longestDays} ${profile.streak.days || 'days'}`, 24, p.onSurface, 700));
  b.push(renderText(28 + cardW + 80, 138, profile.streak.longest || 'Longest this year', 13, p.onSurfaceVariant, 500));
  b.push('</g>');

  return wrapSvg(W, h, b.join(''), profile.streak.title || 'Streak', profile.motion);
}

// 7. Wave SVG
export function generateWaveSvg(p: PaletteTheme, motion = true): string {
  const h = 28;
  const d = generateWavePath(W, h);
  const b: string[] = [];
  b.push(`<clipPath id="w"><rect x="0" y="0" width="${W}" height="${h}"/></clipPath><g clip-path="url(#w)">`);
  b.push(`<path class="wave" d="${d}" fill="none" stroke="${p.primary}" stroke-width="5" stroke-linecap="round"/></g>`);
  return wrapSvg(W, h, b.join(''), 'divider', motion);
}

// 8. Button SVG
export function generateButtonSvg(
  label: string,
  ic: string,
  kind: 'filled' | 'tonal' | 'outlined',
  p: PaletteTheme,
  motion = true
): string {
  const h = 56;
  const size = 17;
  const w = 28 * 2 + 22 + 10 + textWidth(label, size, 600);
  let bg: string;
  let fg: string;

  if (kind === 'filled') {
    bg = p.primary;
    fg = p.onPrimary;
  } else if (kind === 'tonal') {
    bg = p.secondaryContainer;
    fg = p.onSecondaryContainer;
  } else {
    bg = p.surfaceContainerLow;
    fg = p.onSurface;
  }

  const b = [`<g class="pop"><rect width="${w.toFixed(1)}" height="${h}" rx="28" fill="${bg}" ${kind === 'outlined' ? `stroke="${p.outlineVariant}"` : ''}/>`];
  b.push(renderIcon(ic, 28, (h - 22) / 2, 22, fg));
  b.push(renderText(28 + 22 + 10, h / 2 + 6, label, size, fg, 600) + '</g>');

  return wrapSvg(Math.round(w), h, b.join(''), label, motion);
}

// 9. Social Cap SVG (left or right end for continuous banner in GitHub README)
export function generateSocialCapSvg(side: 'left' | 'right', w: number, p: PaletteTheme): string {
  const h = 88;
  const r = 32;
  let d: string;
  if (side === 'left') {
    d = `M${w} 0 L${r} 0 A${r} ${r} 0 0 0 0 ${r} L0 ${h - r} A${r} ${r} 0 0 0 ${r} ${h} L${w} ${h} Z`;
  } else {
    d = `M0 0 L${w - r} 0 A${r} ${r} 0 0 1 ${w} ${r} L${w} ${h - r} A${r} ${r} 0 0 1 ${w - r} ${h} L0 ${h} Z`;
  }
  return wrapSvg(w, h, `<path d="${d}" fill="${p.surfaceContainerLow}"/>`, side, false);
}

// 10. Social Slice Button SVG (for continuous card row in GitHub README)
export function generateSocialSliceSvg(
  label: string,
  ic: string,
  w: number,
  p: PaletteTheme,
  motion = true
): string {
  const h = 88;
  const size = 15;
  const bw = Math.min(w - 8, 16 * 2 + 20 + 8 + textWidth(label, size, 600));
  const bx = (w - bw) / 2;
  const by = (h - 46) / 2;

  const b = [`<rect width="${w}" height="${h}" fill="${p.surfaceContainerLow}"/>`];
  b.push(`<g class="pop"><rect x="${bx.toFixed(1)}" y="${by}" width="${bw.toFixed(1)}" height="46" rx="23" fill="${p.secondaryContainer}"/>`);
  b.push(renderIcon(ic, bx + 16, by + 13, 20, p.onSecondaryContainer));
  b.push(renderText(bx + 16 + 20 + 8, by + 29, label, size, p.onSecondaryContainer, 600) + '</g>');

  return wrapSvg(Math.round(w), h, b.join(''), label, motion);
}

// 11. Social Pill SVG (for individual standalone preview chips)
export function generateSocialPillSvg(
  label: string,
  ic: string,
  p: PaletteTheme,
  motion = true
): string {
  const h = 48;
  const size = 15;
  const w = 22 * 2 + 20 + 8 + textWidth(label, size, 600);
  const bg = p.secondaryContainer;
  const fg = p.onSecondaryContainer;
  const b = [`<g class="pop"><rect width="${w.toFixed(1)}" height="${h}" rx="24" fill="${bg}"/>`];
  b.push(renderIcon(ic, 20, (h - 20) / 2, 20, p.primary));
  b.push(renderText(20 + 20 + 8, h / 2 + 5, label, size, fg, 600) + '</g>');
  return wrapSvg(Math.round(w), h, b.join(''), label, motion);
}

// Generate Readme Markdown matching generate.py readme()
export function generateReadmeMarkdown(profile: ProfileConfig, pins: PinnedRepo[]): string {
  const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '');
  const pic = (name: string, alt: string, width = '100%', height?: string) => {
    const hAttr = height ? ` height="${height}"` : '';
    return `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" width="${width}"${hAttr} alt="${escapeHtml(alt)}"></picture>`;
  };

  // Standalone separated social pill chips (Facebook, Instagram, WhatsApp) with clean spacing
  const socialsHtml = profile.socials.items
    .map((s, idx) => {
      const brand = s.icon.replace('brand:', '');
      const alt = brand.charAt(0).toUpperCase() + brand.slice(1);
      return `<a href="${s.url}">${pic(`social-${idx + 1}`, alt, 'auto', '42')}</a>`;
    })
    .join('&nbsp;&nbsp;');

  const cards = pins.map(
    (pin) => `<a href="${pin.url}">${pic('project-' + slug(pin.name), pin.name, '49%')}</a>`
  );

  const rows: string[] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2).join('&nbsp;'));
  }

  const buttonsHtml = profile.buttons.items
    .map(
      (b, idx) =>
        `<a href="${b.url}">${pic(`button-${idx + 1}`, b.label, 'auto', '46')}</a>`
    )
    .join('&nbsp;&nbsp;');

  const blocks: string[] = [
    pic('hero', profile.hero.greeting + ' ' + (profile.hero.name || profile.login)),
    socialsHtml,
    pic('about', profile.about.title || 'About me'),
    pic('stack', profile.stack.title || 'Tech stack'),
    ...rows,
    pic('stats', profile.stats.title || 'GitHub activity'),
    pic('streak', profile.streak.title || 'Streak'),
    pic('wave', ''),
    buttonsHtml,
  ];

  return '<div align="center">\n\n' + blocks.join('\n\n') + '\n\n</div>\n';
}
