import fs from 'fs';
import path from 'path';
import { DEFAULT_PROFILE, DEFAULT_STATS, DEFAULT_PALETTE } from '../src/data/defaultData';
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
  generateSocialCapSvg,
  generateSocialSliceSvg,
  generateReadmeMarkdown,
} from '../src/utils/svgBuilder';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'assets');
const publicAssetsDir = path.join(rootDir, 'public', 'assets');

[assetsDir, publicAssetsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const files: Record<string, string> = {};

(['light', 'dark'] as const).forEach((theme) => {
  const p = DEFAULT_PALETTE[theme];

  files[`hero-${theme}.svg`] = generateHeroSvg(DEFAULT_PROFILE, p);
  files[`about-${theme}.svg`] = generateAboutSvg(DEFAULT_PROFILE, p);
  files[`stack-${theme}.svg`] = generateStackSvg(DEFAULT_PROFILE, p);
  files[`stats-${theme}.svg`] = generateStatsSvg(DEFAULT_PROFILE, DEFAULT_STATS, p);
  files[`streak-${theme}.svg`] = generateStreakSvg(DEFAULT_PROFILE, DEFAULT_STATS, p);
  files[`wave-${theme}.svg`] = generateWaveSvg(p, DEFAULT_PROFILE.motion);
  files[`credit-${theme}.svg`] = generateCreditSvg(p, DEFAULT_PROFILE.motion);

  // Socials sliced row matching the original continuous card:
  // social-l (175px = 20.833%), social-1 (160px = 19.048%), social-2 (170px = 20.238%), social-3 (170px = 20.238%), social-r (165px = 19.643%) -> Total = 840px (100%)
  files[`social-l-${theme}.svg`] = generateSocialCapSvg('left', 175, p);
  files[`social-1-${theme}.svg`] = generateSocialSliceSvg('Facebook', 'brand:facebook', 160, p, DEFAULT_PROFILE.motion);
  files[`social-2-${theme}.svg`] = generateSocialSliceSvg('Instagram', 'brand:instagram', 170, p, DEFAULT_PROFILE.motion);
  files[`social-3-${theme}.svg`] = generateSocialSliceSvg('WhatsApp', 'brand:whatsapp', 170, p, DEFAULT_PROFILE.motion);
  files[`social-r-${theme}.svg`] = generateSocialCapSvg('right', 165, p);

  DEFAULT_STATS.pins.forEach((pin, i) => {
    const slug = pin.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/^-+|-+$/g, '');
    files[`project-${slug}-${theme}.svg`] = generateProjectCardSvg(pin, i, p, DEFAULT_PROFILE.motion);
  });

  DEFAULT_PROFILE.buttons.items.forEach((b, i) => {
    files[`button-${i + 1}-${theme}.svg`] = generateButtonSvg(b.label, b.icon, b.style, p, DEFAULT_PROFILE.motion);
  });
});

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(assetsDir, filename), content, 'utf8');
  fs.writeFileSync(path.join(publicAssetsDir, filename), content, 'utf8');
}

// Generate the exact README.md for AlexJamesHQ
const readmeMarkdown = generateReadmeMarkdown(DEFAULT_PROFILE, DEFAULT_STATS.pins);
fs.writeFileSync(path.join(rootDir, 'README.md'), readmeMarkdown, 'utf8');
fs.writeFileSync(path.join(rootDir, 'public', 'README.md'), readmeMarkdown, 'utf8');

console.log(`Successfully generated ${Object.keys(files).length} SVG assets and README.md!`);
