import fs from 'fs';
import path from 'path';
import https from 'https';
import { DEFAULT_PROFILE, DEFAULT_STATS, DEFAULT_PALETTE } from '../src/data/defaultData';
import { StatsData } from '../src/types';
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

function httpGet(url: string, token?: string): Promise<any> {
  return new Promise((resolve) => {
    const headers: Record<string, string> = { 'User-Agent': 'AlexJamesHQ-Profile-Generator' };
    if (token) headers['Authorization'] = `token ${token}`;

    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function fetchLiveStats(): Promise<StatsData> {
  const stats: StatsData = JSON.parse(JSON.stringify(DEFAULT_STATS));
  const username = DEFAULT_PROFILE.login || 'AlexJamesHQ';
  const token = process.env.GITHUB_TOKEN;

  try {
    const user = await httpGet(`https://api.github.com/users/${username}`, token);
    if (user && user.login) {
      if (typeof user.public_repos === 'number') stats.repos = user.public_repos;
      if (typeof user.followers === 'number') stats.followers = user.followers;
    }

    const repos = await httpGet(`https://api.github.com/users/${username}/repos?per_page=100`, token);
    if (Array.isArray(repos)) {
      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      stats.stars = totalStars;

      // Update 6 pinned repos stars & info if found
      stats.pins = stats.pins.map((pin) => {
        const matching = repos.find((r) => r.name.toLowerCase() === pin.name.toLowerCase());
        if (matching) {
          return {
            ...pin,
            stars: matching.stargazers_count ?? pin.stars,
            language: matching.language || pin.language,
            url: matching.html_url || pin.url,
            text: matching.description || pin.text,
          };
        }
        return pin;
      });
    }

    // Fetch real live contributions and streak from GitHub
    const contribData = await httpGet(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
    if (contribData && contribData.contributions && Array.isArray(contribData.contributions)) {
      const contribs = contribData.contributions;
      if (contribData.total) {
        const totalYear = Object.values(contribData.total).reduce((a: any, b: any) => Number(a) + Number(b), 0);
        stats.contributions = totalYear as number;
      }

      // Calculate current & longest streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      for (let i = contribs.length - 1; i >= 0; i--) {
        if (contribs[i].count > 0) {
          currentStreak++;
        } else if (i === contribs.length - 1) {
          continue;
        } else {
          break;
        }
      }

      for (const c of contribs) {
        if (c.count > 0) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      // Update 21 days calendar matrix (3 weeks x 7 days)
      const last21Days = contribs.slice(-21);
      const daysMatrix: any[][] = [[], [], []];
      last21Days.forEach((item: { date: string; count: number; level: number }, idx: number) => {
        const col = Math.floor(idx / 7);
        const itemDate = new Date(item.date);
        const dayNum = itemDate.getDate();
        const isToday = idx === last21Days.length - 1;
        if (daysMatrix[col]) {
          daysMatrix[col].push({
            c: item.count || 0,
            day: isNaN(dayNum) ? idx + 1 : dayNum,
            today: isToday,
          });
        }
      });

      stats.days = daysMatrix;
      (stats as any).streak = {
        title: 'Streak',
        current: 'Current streak',
        longest: 'Longest this year',
        days: 'days',
        currentStreakCount: currentStreak,
        longestStreakCount: longestStreak,
      };
    }
  } catch (err) {
    console.log('GitHub API fetch fallback:', err);
  }

  return stats;
}

async function main() {
  const liveStats = await fetchLiveStats();
  const files: Record<string, string> = {};

  (['light', 'dark'] as const).forEach((theme) => {
    const p = DEFAULT_PALETTE[theme];

    files[`hero-${theme}.svg`] = generateHeroSvg(DEFAULT_PROFILE, p);
    files[`about-${theme}.svg`] = generateAboutSvg(DEFAULT_PROFILE, p);
    files[`stack-${theme}.svg`] = generateStackSvg(DEFAULT_PROFILE, p);
    files[`stats-${theme}.svg`] = generateStatsSvg(DEFAULT_PROFILE, liveStats, p);
    files[`streak-${theme}.svg`] = generateStreakSvg(DEFAULT_PROFILE, liveStats, p);
    files[`wave-${theme}.svg`] = generateWaveSvg(p, DEFAULT_PROFILE.motion);

    // Standalone separated social pill chips (Facebook, Instagram, WhatsApp)
    DEFAULT_PROFILE.socials.items.forEach((s, i) => {
      const brand = s.icon.replace('brand:', '');
      const label = brand.charAt(0).toUpperCase() + brand.slice(1);
      files[`social-${i + 1}-${theme}.svg`] = generateSocialPillSvg(label, s.icon, p, DEFAULT_PROFILE.motion);
    });

    liveStats.pins.forEach((pin, i) => {
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

  // Update stats.json
  fs.writeFileSync(path.join(rootDir, 'src', 'data', 'stats.json'), JSON.stringify(liveStats, null, 1), 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'data', 'stats.json'), JSON.stringify(liveStats, null, 1), 'utf8');

  // Generate the exact README.md for AlexJamesHQ
  const readmeMarkdown = generateReadmeMarkdown(DEFAULT_PROFILE, liveStats.pins);
  fs.writeFileSync(path.join(rootDir, 'README.md'), readmeMarkdown, 'utf8');

  console.log(`Successfully generated ${Object.keys(files).length} SVG assets and README.md with live GitHub stats!`);
}

main();
