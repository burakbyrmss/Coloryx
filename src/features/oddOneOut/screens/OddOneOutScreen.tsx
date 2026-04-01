import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorTile } from '@/components/ColorTile';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RootStackParamList } from '@/navigation/types';
import {
  advanceOddAfterCorrect,
  continueAfterWrong,
  exitToMenu,
  startOddOneOut,
  tapOddTile,
} from '@/store/slices/gameSlice';
import { considerBestScore } from '@/store/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { triggerErrorHaptic, triggerLightHaptic } from '@/utils/haptics';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OddOneOut'>;

const CORRECT_DELAY_MS = 420;
const WRONG_DELAY_MS = 720;

export function OddOneOutScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const odd = useAppSelector(s => s.game.oddOneOut);
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const hapticsEnabled = useAppSelector(s => s.settings.hapticsEnabled);

  const [lastWrongTap, setLastWrongTap] = useState<number | null>(null);
  const pendingNav = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(startOddOneOut());
    return () => {
      if (pendingNav.current) {
        clearTimeout(pendingNav.current);
      }
    };
  }, [dispatch]);

  const handleTap = useCallback(
    (index: number) => {
      if (!odd || odd.feedback !== 'none') {
        return;
      }
      const isCorrect = index === odd.oddIndex;
      dispatch(tapOddTile(index));
      if (isCorrect) {
        triggerLightHaptic(hapticsEnabled);
        setLastWrongTap(null);
        pendingNav.current = setTimeout(() => {
          dispatch(advanceOddAfterCorrect());
          pendingNav.current = null;
        }, CORRECT_DELAY_MS);
      } else {
        triggerErrorHaptic(hapticsEnabled);
        setLastWrongTap(index);
      }
    },
    [dispatch, odd, hapticsEnabled],
  );

  useEffect(() => {
    if (!odd || odd.feedback !== 'wrong') {
      return;
    }
    const finalScore = odd.runScore;
    const outOfLives = odd.lives <= 0;
    const id = setTimeout(() => {
      if (outOfLives) {
        const wasNew = finalScore > bestOdd;
        dispatch(considerBestScore({ mode: 'oddOneOut', score: finalScore }));
        dispatch(continueAfterWrong());
        navigation.replace('Result', {
          mode: 'oddOneOut',
          score: finalScore,
          isNewBest: wasNew,
        });
      } else {
        dispatch(continueAfterWrong());
        setLastWrongTap(null);
      }
    }, WRONG_DELAY_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- wrong branch uses scalar fields only
  }, [odd?.feedback, odd?.lives, odd?.runScore, bestOdd, dispatch, navigation]);

  if (!odd) {
    return (
      <ErrorBoundary>
        <SafeAreaView className="flex-1 bg-surface" />
      </ErrorBoundary>
    );
  }

  const tileFeedback = (i: number): 'none' | 'pulse' | 'shake' => {
    if (odd.feedback === 'correct' && i === odd.oddIndex) {
      return 'pulse';
    }
    if (odd.feedback === 'wrong' && lastWrongTap === i) {
      return 'shake';
    }
    return 'none';
  };

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-4 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Leave game"
              onPress={() => {
                dispatch(exitToMenu());
                navigation.navigate('Home');
              }}
              className="min-h-[44px] min-w-[44px] justify-center">
              <Text className="text-text-secondary">← Home</Text>
            </Pressable>
            <View className="items-end">
              <Text className="text-text-secondary">Score</Text>
              <Text className="text-xl font-bold text-text-primary">
                {odd.runScore}
              </Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-center justify-center gap-2">
            {[0, 1, 2].map(i => (
              <View
                key={i}
                className={`h-3 w-8 rounded-full ${i < odd.lives ? 'bg-accent' : 'bg-surface-elevated'}`}
              />
            ))}
          </View>

          <Text className="mb-4 text-center text-text-muted">
            Round {odd.round}
          </Text>

          <View className="mx-auto aspect-square w-full max-w-[340px] flex-row flex-wrap">
            {Array.from({ length: 9 }, (_, i) => {
              const sat =
                i === odd.oddIndex ? odd.oddSaturation : odd.baseSaturation;
              return (
                <View key={i} className="aspect-square w-[33.333%] p-1">
                  <ColorTile
                    index={i}
                    hue={odd.baseHue}
                    saturation={sat}
                    brightness={odd.baseBrightness}
                    feedback={tileFeedback(i)}
                    onPress={handleTap}
                    disabled={odd.feedback !== 'none'}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
