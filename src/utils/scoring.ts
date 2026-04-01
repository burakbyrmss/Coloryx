import type { HSB } from '@/types/hsb';

/** Circular hue difference normalized to 0–1 (max error at 180°). */
export function normalizedHueErrorDeg(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  const circ = Math.min(diff, 360 - diff);
  return circ / 180;
}

/**
 * Remember the Color score 0–100.
 * Weighting: Hue 40%, Saturation 30%, Brightness 30%.
 */
export function rememberColorMatchScore(target: HSB, guess: HSB): number {
  const eH = normalizedHueErrorDeg(target.h, guess.h);
  const eS = Math.abs(target.s - guess.s) / 100;
  const eB = Math.abs(target.b - guess.b) / 100;
  const combined = 0.4 * eH + 0.3 * eS + 0.3 * eB;
  const raw = (1 - combined) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function oddOneOutPointsForRound(roundNumber: number): number {
  return 10 + roundNumber;
}
