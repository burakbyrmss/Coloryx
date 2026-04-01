import type { HSB } from '@/types/hsb';

/**
 * Stops for a horizontal full hue strip (HSV S=100%, V=100%):
 * red → yellow → green → cyan → blue → magenta → red.
 */
export const HUE_SPECTRUM_GRADIENT_COLORS = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff0000',
] as const;

/**
 * Converts HSB (H 0–360, S/B 0–100) to an `rgb()` string for React Native.
 */
export function hsbToRgbString(h: number, s: number, b: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const vv = Math.max(0, Math.min(100, b)) / 100;
  const c = vv * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vv - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hh < 60) {
    rp = c;
    gp = x;
  } else if (hh < 120) {
    rp = x;
    gp = c;
  } else if (hh < 180) {
    gp = c;
    bp = x;
  } else if (hh < 240) {
    gp = x;
    bp = c;
  } else if (hh < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }

  const r = Math.round((rp + m) * 255);
  const g = Math.round((gp + m) * 255);
  const bl = Math.round((bp + m) * 255);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Target colors stay in a readable range (not too dark / gray). */
export function randomRememberTarget(): HSB {
  return {
    h: randomInRange(0, 360),
    s: randomInRange(35, 95),
    b: randomInRange(35, 90),
  };
}

export function randomOddOneOutBase(): { h: number; s: number; b: number } {
  return {
    h: randomInRange(0, 360),
    s: randomInRange(40, 85),
    b: randomInRange(45, 90),
  };
}
