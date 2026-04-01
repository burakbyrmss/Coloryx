import type { GameMode } from '@/types/hsb';

export type RootStackParamList = {
  Home: undefined;
  OddOneOut: undefined;
  RememberColor: undefined;
  Result: {
    mode: GameMode;
    score: number;
    isNewBest?: boolean;
    /** Last round match % (Remember mode), for tier label */
    lastRoundScore?: number;
  };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
