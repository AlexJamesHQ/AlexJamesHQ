// Mathematical shapes inspired by Material 3 Expressive shapes

export type ShapeKind = 'cookie' | 'cookie12' | 'clover' | 'sunny' | 'flower' | 'pill';

interface ShapeParams {
  n: number;
  a: number;
  sharp: number;
}

const SHAPE_PARAMS: Record<ShapeKind, ShapeParams> = {
  cookie: { n: 9, a: 0.07, sharp: 1.0 },
  cookie12: { n: 12, a: 0.05, sharp: 1.0 },
  clover: { n: 4, a: 0.2, sharp: 1.0 },
  sunny: { n: 8, a: 0.1, sharp: 2.2 },
  flower: { n: 8, a: 0.16, sharp: 1.0 },
  pill: { n: 2, a: 0.0, sharp: 1.0 },
};

export function generateShapePath(kind: ShapeKind, cx: number, cy: number, r: number): string {
  const params = SHAPE_PARAMS[kind] || SHAPE_PARAMS.cookie;
  const { n, a, sharp } = params;
  const pts: [number, number][] = [];
  const steps = 180;

  for (let i = 0; i < steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    let wave = Math.cos(n * t);
    const sign = wave >= 0 ? 1 : -1;
    wave = sign * Math.pow(Math.abs(wave), 1 / sharp);
    const rr = r * (1 - a + a * wave);
    const x = cx + rr * Math.cos(t - Math.PI / 2);
    const y = cy + rr * Math.sin(t - Math.PI / 2);
    pts.push([Number(x.toFixed(1)), Number(y.toFixed(1))]);
  }

  return 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L') + ' Z';
}

export function generateWavePath(width: number, height: number, amp = 5, length = 48): string {
  const pts: string[] = [];
  for (let i = 0; i <= width + length * 2; i += 4) {
    const y = height / 2 + amp * Math.sin((2 * Math.PI * i) / length);
    pts.push(`${i} ${y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
}
