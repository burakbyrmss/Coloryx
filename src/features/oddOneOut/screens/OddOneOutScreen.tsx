import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorTile } from '@/components/ColorTile';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
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

function formatElapsedSeconds(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function OddOneOutScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const odd = useAppSelector(s => s.game.oddOneOut);
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const hapticsEnabled = useAppSelector(s => s.settings.hapticsEnabled);

  const [lastWrongTap, setLastWrongTap] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const pendingNav = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!odd) {
      return;
    }
    const id = setInterval(() => {
      setElapsedSeconds(sec => sec + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [odd]);

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
        const lastBoard = {
          baseHue: odd.baseHue,
          baseSaturation: odd.baseSaturation,
          baseBrightness: odd.baseBrightness,
          oddIndex: odd.oddIndex,
          oddSaturation: odd.oddSaturation,
        };
        dispatch(considerBestScore({ mode: 'oddOneOut', score: finalScore }));
        dispatch(continueAfterWrong());
        navigation.replace('OddOneOutResult', {
          score: finalScore,
          isNewBest: wasNew,
          lastBoard,
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
              accessibilityLabel={t('leaveGame')}
              onPress={() => {
                dispatch(exitToMenu());
                navigation.navigate('Home');
              }}
              className="min-h-[44px] min-w-[44px] justify-center">
              <Text className="text-text-secondary">← {t('home')}</Text>
            </Pressable>
            <View className="flex-row items-start gap-6">
              <View className="items-end">
                <Text className="text-text-secondary">{t('time')}</Text>
                <Text className="text-xl font-bold text-text-primary tabular-nums">
                  {formatElapsedSeconds(elapsedSeconds)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-text-secondary">{t('score')}</Text>
                <Text className="text-xl font-bold text-text-primary">
                  {odd.runScore}
                </Text>
              </View>
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
            {t('round', { round: odd.round })}
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

          <Text className="mt-6 max-w-[340px] self-center px-2 text-center text-base leading-6 text-text-secondary">
            {t('oddOneOutInstructions')}
          </Text>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
