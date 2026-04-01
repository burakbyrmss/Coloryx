import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { GameMode } from '@/types/hsb';

export interface StatsState {
  bestOddOneOut: number;
  bestRememberColor: number;
}

const initialState: StatsState = {
  bestOddOneOut: 0,
  bestRememberColor: 0,
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    considerBestScore(
      state,
      action: PayloadAction<{ mode: GameMode; score: number }>,
    ) {
      const { mode, score } = action.payload;
      if (mode === 'oddOneOut' && score > state.bestOddOneOut) {
        state.bestOddOneOut = score;
      }
      if (mode === 'rememberColor' && score > state.bestRememberColor) {
        state.bestRememberColor = score;
      }
    },
    resetStats(state) {
      state.bestOddOneOut = 0;
      state.bestRememberColor = 0;
    },
  },
});

export const { considerBestScore, resetStats } = statsSlice.actions;
