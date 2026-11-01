import { PaletteTheme, PaletteData } from '../types';

export function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mix(a: string, b: string, t: number): string {
  const [ra, ga, ba] = hexToRgb(a);
  const [rb, gb, bb] = hexToRgb(b);
  return rgbToHex(
    ra + (rb - ra) * t,
    ga + (gb - ga) * t,
    ba + (bb - ba) * t
  );
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (300 <= h && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// Generate an algorithmic Material 3 Tonal Palette from any seed hex color
export function generateMaterial3Palette(seedHex: string): PaletteData {
  const [r, g, b] = hexToRgb(seedHex);
  const [h, s] = rgbToHsl(r, g, b);

  const primaryHue = h;
  const secondaryHue = (h + 15) % 360;
  const tertiaryHue = (h + 60) % 360;

  const getTone = (hue: number, sat: number, tone: number) => {
    const l = tone / 100;
    const [cr, cg, cb] = hslToRgb(hue, sat, l);
    return rgbToHex(cr, cg, cb);
  };

  const pSat = Math.min(Math.max(s, 0.4), 0.85);
  const sSat = Math.min(pSat * 0.45, 0.4);
  const tSat = Math.min(pSat * 0.6, 0.65);
  const nSat = 0.08; // Neutral saturation

  const light: PaletteTheme = {
    primary: getTone(primaryHue, pSat, 42),
    onPrimary: '#ffffff',
    primaryContainer: getTone(primaryHue, pSat, 90),
    onPrimaryContainer: getTone(primaryHue, pSat, 22),

    secondary: getTone(secondaryHue, sSat, 42),
    onSecondary: '#ffffff',
    secondaryContainer: getTone(secondaryHue, sSat, 90),
    onSecondaryContainer: getTone(secondaryHue, sSat, 22),

    tertiary: getTone(tertiaryHue, tSat, 40),
    onTertiary: '#ffffff',
    tertiaryContainer: getTone(tertiaryHue, tSat, 88),
    onTertiaryContainer: getTone(tertiaryHue, tSat, 20),

    surface: getTone(primaryHue, nSat, 98),
    surfaceDim: getTone(primaryHue, nSat, 87),
    surfaceBright: getTone(primaryHue, nSat, 98),
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: getTone(primaryHue, nSat, 96),
    surfaceContainer: getTone(primaryHue, nSat, 94),
    surfaceContainerHigh: getTone(primaryHue, nSat, 92),
    surfaceContainerHighest: getTone(primaryHue, nSat, 90),

    onSurface: getTone(primaryHue, nSat, 10),
    onSurfaceVariant: getTone(primaryHue, nSat * 1.5, 30),
    outline: getTone(primaryHue, nSat * 1.5, 50),
    outlineVariant: getTone(primaryHue, nSat * 1.5, 80),
  };

  const dark: PaletteTheme = {
    primary: getTone(primaryHue, pSat, 80),
    onPrimary: getTone(primaryHue, pSat, 20),
    primaryContainer: getTone(primaryHue, pSat, 32),
    onPrimaryContainer: getTone(primaryHue, pSat, 90),

    secondary: getTone(secondaryHue, sSat, 80),
    onSecondary: getTone(secondaryHue, sSat, 20),
    secondaryContainer: getTone(secondaryHue, sSat, 32),
    onSecondaryContainer: getTone(secondaryHue, sSat, 90),

    tertiary: getTone(tertiaryHue, tSat, 80),
    onTertiary: getTone(tertiaryHue, tSat, 20),
    tertiaryContainer: getTone(tertiaryHue, tSat, 30),
    onTertiaryContainer: getTone(tertiaryHue, tSat, 90),

    surface: getTone(primaryHue, nSat, 8),
    surfaceDim: getTone(primaryHue, nSat, 8),
    surfaceBright: getTone(primaryHue, nSat, 24),
    surfaceContainerLowest: getTone(primaryHue, nSat, 5),
    surfaceContainerLow: getTone(primaryHue, nSat, 11),
    surfaceContainer: getTone(primaryHue, nSat, 13),
    surfaceContainerHigh: getTone(primaryHue, nSat, 17),
    surfaceContainerHighest: getTone(primaryHue, nSat, 21),

    onSurface: getTone(primaryHue, nSat, 90),
    onSurfaceVariant: getTone(primaryHue, nSat * 1.5, 80),
    outline: getTone(primaryHue, nSat * 1.5, 60),
    outlineVariant: getTone(primaryHue, nSat * 1.5, 30),
  };

  return { light, dark };
}
