import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  rememberCardElevated,
  RememberSessionHeader,
  formatHsbLine,
  formatRememberPoints,
  formatRememberRoundIndicator,
  rememberMatchTierLabel,
} from '@/features/rememberColor/rememberShared';
import type { RootStackParamList } from '@/navigation/types';
import {
  endRememberSession,
  nextRememberRound,
} from '@/store/slices/gameSlice';
import { considerBestScore } from '@/store/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hsbToRgbString } from '@/utils/color';
import { normalizedHueErrorDeg, REMEMBER_MAX_ROUNDS, REMEMBER_SESSION_MAX } from '@/utils/scoring';

type Nav = NativeStackNavigationProp<
  RootStackParamList,
  'RememberRoundResult'
>;

export function RememberRoundResultScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const remember = useAppSelector(s => s.game.remember);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);

  useFocusEffect(
    useCallback(() => {
      if (!remember) {
        navigation.replace('Home');
        return;
      }
      if (remember.phase === 'preview') {
        navigation.replace('RememberColor');
        return;
      }
      if (remember.phase === 'guess') {
        navigation.replace('RememberGuess');
      }
    }, [remember, navigation]),
  );

  const guessPreview = useMemo(() => {
    if (!remember) {
      return 'rgb(128,128,128)';
    }
    const { h, s, b } = remember.guess;
    return hsbToRgbString(h, s, b);
  }, [remember]);

  const targetPreview = useMemo(() => {
    if (!remember) {
      return 'rgb(128,128,128)';
    }
    const { h, s, b } = remember.target;
    return hsbToRgbString(h, s, b);
  }, [remember]);

  if (
    !remember ||
    remember.phase !== 'result' ||
    remember.lastResultScore === null
  ) {
    return (
      <ErrorBoundary>
        <SafeAreaView className="flex-1 bg-surface" />
      </ErrorBoundary>
    );
  }

  const deltaH = Math.round(
    normalizedHueErrorDeg(remember.target.h, remember.guess.h) * 180,
  );
  const deltaS = Math.round(Math.abs(remember.target.s - remember.guess.s));
  const deltaB = Math.round(Math.abs(remember.target.b - remember.guess.b));

  const onLeave = () => {
    dispatch(endRememberSession());
    navigation.replace('Home');
  };

  const goToFinalResult = () => {
    const total = remember.sessionScore;
    const lastRound = remember.lastResultScore ?? 0;
    const hist = [...remember.roundHistory];
    const wasNew = total > bestRemember;
    dispatch(considerBestScore({ mode: 'rememberColor', score: total }));
    dispatch(endRememberSession());
    navigation.replace('RememberColorResult', {
      score: total,
      isNewBest: wasNew,
      lastRoundScore: lastRound,
      rememberRoundHistory: hist,
      rememberSessionMax: REMEMBER_SESSION_MAX,
    });
  };

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-4 pt-2 pb-20">
          <RememberSessionHeader onLeave={onLeave} />

          <View className="mt-1 min-h-0 flex-1">
            <View
              className="min-h-0 flex-1 flex-col overflow-hidden rounded-2xl"
              style={rememberCardElevated.wrap}>
              <View className="min-h-0 flex-1">
                <View
                  className="relative flex-1 justify-end"
                  style={{ backgroundColor: targetPreview }}>
                  <View className="absolute left-4 top-3 z-10">
                    <Text className="text-base font-medium text-white">
                      {formatRememberRoundIndicator(remember.round)}
                    </Text>
                  </View>
                  <View className="bg-black/35 px-4 py-3">
                    <Text className="text-sm text-white/80">Original</Text>
                    <Text className="mt-0.5 text-lg font-bold text-white">
                      {formatHsbLine(remember.target)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="min-h-0 flex-1">
                <View
                  className="relative flex-1 justify-end"
                  style={{ backgroundColor: guessPreview }}>
                  <View className="absolute left-4 top-3 z-10">
                    <Text className="text-base font-medium text-white">
                      {formatRememberRoundIndicator(remember.round)}
                    </Text>
                  </View>
                  <View className="absolute right-4 top-4 z-10 max-w-[58%] items-end">
                    <Text className="text-4xl font-bold text-white">
                      {formatRememberPoints(remember.lastResultScore)}
                    </Text>
                    <Text className="mt-0.5 text-right text-xs text-white/80">
                      pts this round
                    </Text>
                    <Text className="mt-0.5 text-right text-sm text-white/90">
                      {rememberMatchTierLabel(remember.lastResultScore)}
                    </Text>
                  </View>
                  <View className="flex-row items-end justify-between bg-black/35 px-4 py-3 pr-20">
                    <View className="min-w-0 flex-1">
                      <Text className="text-sm text-white/80">
                        Your selection
                      </Text>
                      <Text className="mt-0.5 text-lg font-bold text-white">
                        {formatHsbLine(remember.guess)}
                      </Text>
                    </View>
                  </View>
                  <View className="absolute bottom-3 right-3 z-10">
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        remember.round >= REMEMBER_MAX_ROUNDS
                          ? 'View results'
                          : 'Next round'
                      }
                      onPress={() => {
                        if (remember.round >= REMEMBER_MAX_ROUNDS) {
                          goToFinalResult();
                          return;
                        }
                        dispatch(nextRememberRound());
                        navigation.replace('RememberColor');
                      }}
                      className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-md"
                      style={rememberCardElevated.fab}>
                      <Text className="text-2xl text-black">→</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <Text className="mt-3 text-center text-xs text-text-muted">
              Δ Hue ~{deltaH}° · Δ S {deltaS} · Δ B {deltaB}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
