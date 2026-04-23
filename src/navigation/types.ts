import type { RememberRoundRecord } from '@/store/slices/gameSlice';

export type RootStackParamList = {
  NameSetup: undefined;
  Home: undefined;
  TemporaryTitle: undefined;
  Leaderboards: undefined;
  OddOneOut: undefined;
  RememberColor: undefined;
  RememberGuess: undefined;
  RememberRoundResult: undefined;
  RememberColorResult: {
    score: number;
    isNewBest?: boolean;
    lastRoundScore?: number;
    rememberRoundHistory?: RememberRoundRecord[];
    rememberSessionMax?: number;
  };
  OddOneOutResult: {
    score: number;
    isNewBest?: boolean;
    /** Last round board when the run ended (failed life). */
    lastBoard?: {
      baseHue: number;
      baseSaturation: number;
      baseBrightness: number;
      oddIndex: number;
      oddSaturation: number;
    };
  };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
