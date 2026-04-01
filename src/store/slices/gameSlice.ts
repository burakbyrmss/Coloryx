import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { GameMode, HSB } from '@/types/hsb';
import { randomOddOneOutBase, randomRememberTarget } from '@/utils/color';
import {
  oddOneOutPointsForRound,
  rememberColorMatchScore,
  rememberRoundPoints,
  REMEMBER_MAX_ROUNDS,
} from '@/utils/scoring';

export const INITIAL_SATURATION_DELTA = 25;
export const SATURATION_DELTA_STEP = 1;
export const MIN_SATURATION_DELTA = 5;
export const PREVIEW_DURATION_SEC = 5;

export type OddFeedback = 'none' | 'correct' | 'wrong';

export interface OddOneOutGameState {
  round: number;
  runScore: number;
  lives: number;
  saturationDelta: number;
  oddIndex: number;
  baseHue: number;
  baseSaturation: number;
  baseBrightness: number;
  oddSaturation: number;
  feedback: OddFeedback;
}

export type RememberPhase = 'preview' | 'guess' | 'result';

export interface RememberRoundRecord {
  target: HSB;
  guess: HSB;
  points: number;
}

export interface RememberGameState {
  round: number;
  /** Cumulative points this session (max REMEMBER_SESSION_MAX). */
  sessionScore: number;
  /** Completed rounds only (length ≤ REMEMBER_MAX_ROUNDS). */
  roundHistory: RememberRoundRecord[];
  target: HSB;
  guess: HSB;
  phase: RememberPhase;
  /** Points earned this round (0–10), null before scoring. */
  lastResultScore: number | null;
}

export interface GameSliceState {
  activeMode: GameMode | null;
  oddOneOut: OddOneOutGameState | null;
  remember: RememberGameState | null;
}

const initialState: GameSliceState = {
  activeMode: null,
  oddOneOut: null,
  remember: null,
};

function buildOddRound(
  round: number,
  runScore: number,
  lives: number,
  saturationDelta: number,
): OddOneOutGameState {
  const base = randomOddOneOutBase();
  const oddIndex = Math.floor(Math.random() * 9);
  const goHigher = Math.random() < 0.5;
  let oddSaturation = goHigher
    ? base.s + saturationDelta
    : base.s - saturationDelta;
  oddSaturation = Math.max(0, Math.min(100, oddSaturation));
  if (Math.abs(oddSaturation - base.s) < 0.5) {
    oddSaturation =
      goHigher ? Math.min(100, base.s + saturationDelta) : Math.max(0, base.s - saturationDelta);
  }
  return {
    round,
    runScore,
    lives,
    saturationDelta,
    oddIndex,
    baseHue: base.h,
    baseSaturation: base.s,
    baseBrightness: base.b,
    oddSaturation,
    feedback: 'none',
  };
}

function buildRememberRound(
  round: number,
  sessionScore: number,
  roundHistory: RememberRoundRecord[],
): RememberGameState {
  const target = randomRememberTarget();
  return {
    round,
    sessionScore,
    roundHistory,
    target,
    guess: {
      h: Math.floor(Math.random() * 360),
      s: 50,
      b: 50,
    },
    phase: 'preview',
    lastResultScore: null,
  };
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startOddOneOut(state) {
      state.activeMode = 'oddOneOut';
      state.remember = null;
      state.oddOneOut = buildOddRound(1, 0, 3, INITIAL_SATURATION_DELTA);
    },
    tapOddTile(state, action: PayloadAction<number>) {
      if (state.activeMode !== 'oddOneOut' || !state.oddOneOut) {
        return;
      }
      const g = state.oddOneOut;
      if (g.feedback !== 'none') {
        return;
      }
      const index = action.payload;
      if (index === g.oddIndex) {
        g.feedback = 'correct';
        g.runScore += oddOneOutPointsForRound(g.round);
        g.saturationDelta = Math.max(
          MIN_SATURATION_DELTA,
          g.saturationDelta - SATURATION_DELTA_STEP,
        );
      } else {
        g.feedback = 'wrong';
        g.lives -= 1;
      }
    },
    advanceOddAfterCorrect(state) {
      if (state.activeMode !== 'oddOneOut' || !state.oddOneOut) {
        return;
      }
      const g = state.oddOneOut;
      if (g.feedback !== 'correct') {
        return;
      }
      const nextRound = g.round + 1;
      state.oddOneOut = buildOddRound(
        nextRound,
        g.runScore,
        g.lives,
        g.saturationDelta,
      );
    },
    continueAfterWrong(state) {
      if (state.activeMode !== 'oddOneOut' || !state.oddOneOut) {
        return;
      }
      const g = state.oddOneOut;
      if (g.feedback !== 'wrong') {
        return;
      }
      if (g.lives <= 0) {
        state.oddOneOut = null;
        state.activeMode = null;
      } else {
        g.feedback = 'none';
      }
    },
    endOddRun(state) {
      state.oddOneOut = null;
      state.activeMode = null;
    },
    startRememberColor(state) {
      state.activeMode = 'rememberColor';
      state.oddOneOut = null;
      state.remember = buildRememberRound(1, 0, []);
    },
    setRememberPhase(state, action: PayloadAction<RememberPhase>) {
      if (state.remember) {
        state.remember.phase = action.payload;
      }
    },
    updateGuess(state, action: PayloadAction<Partial<HSB>>) {
      if (state.remember && state.remember.phase === 'guess') {
        state.remember.guess = { ...state.remember.guess, ...action.payload };
      }
    },
    submitRememberGuess(state) {
      if (!state.remember || state.remember.phase !== 'guess') {
        return;
      }
      const { target, guess, sessionScore, roundHistory } = state.remember;
      const matchPercent = rememberColorMatchScore(target, guess);
      const points = rememberRoundPoints(matchPercent);
      const record: RememberRoundRecord = {
        target: { ...target },
        guess: { ...guess },
        points,
      };
      state.remember = {
        ...state.remember,
        phase: 'result',
        lastResultScore: points,
        sessionScore: sessionScore + points,
        roundHistory: [...roundHistory, record],
      };
    },
    nextRememberRound(state) {
      if (!state.remember) {
        return;
      }
      if (state.remember.round >= REMEMBER_MAX_ROUNDS) {
        return;
      }
      const { sessionScore, roundHistory } = state.remember;
      state.remember = buildRememberRound(
        state.remember.round + 1,
        sessionScore,
        roundHistory,
      );
    },
    endRememberSession(state) {
      state.remember = null;
      state.activeMode = null;
    },
    exitToMenu(state) {
      state.activeMode = null;
      state.oddOneOut = null;
      state.remember = null;
    },
  },
});

export const {
  startOddOneOut,
  tapOddTile,
  advanceOddAfterCorrect,
  continueAfterWrong,
  endOddRun,
  startRememberColor,
  setRememberPhase,
  updateGuess,
  submitRememberGuess,
  nextRememberRound,
  endRememberSession,
  exitToMenu,
} = gameSlice.actions;
