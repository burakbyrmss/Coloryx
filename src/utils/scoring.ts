import type { HSB } from '@/types/hsb';

/** Remember Color session: exactly 5 rounds, 10 pts max per round, 50 total. */
export const REMEMBER_MAX_ROUNDS = 5;
export const REMEMBER_POINTS_PER_ROUND_MAX = 10;
export const REMEMBER_SESSION_MAX = 50;

/** Map match quality 0–100% to round points 0–10 (one decimal). */
export function rememberRoundPoints(matchPercent0to100: number): number {
  const raw = (matchPercent0to100 / 100) * REMEMBER_POINTS_PER_ROUND_MAX;
  return Math.round(raw * 10) / 10;
}

/** Circular hue difference normalized to 0–1 (max error at 180°). */
export function normalizedHueErrorDeg(h1: number, h2: number): number {
  const diff = Math.abs(h1 - h2);
  const circ = Math.min(diff, 360 - diff);
  return circ / 180;
}

/**
 * Remember the Color score 0–100.
 * Weighting: Hue 60%, Saturation 20%, Brightness 20%.
 */
export function rememberColorMatchScore(target: HSB, guess: HSB): number {
  const eH = normalizedHueErrorDeg(target.h, guess.h);
  const eS = Math.abs(target.s - guess.s) / 100;
  const eB = Math.abs(target.b - guess.b) / 100;
  const combined = 0.6 * eH + 0.2 * eS + 0.2 * eB;
  const raw = (1 - combined) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function oddOneOutPointsForRound(roundNumber: number): number {
  return 10 + roundNumber;
}
