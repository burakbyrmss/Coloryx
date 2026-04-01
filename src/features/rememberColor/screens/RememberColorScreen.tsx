import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HueSpectrumSlider } from '@/components/HueSpectrumSlider';
import type { RootStackParamList } from '@/navigation/types';
import {
  PREVIEW_DURATION_SEC,
  endRememberSession,
  nextRememberRound,
  setRememberPhase,
  startRememberColor,
  submitRememberGuess,
  updateGuess,
} from '@/store/slices/gameSlice';
import { considerBestScore } from '@/store/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import themeColors from '@/theme/colors.json';
import { hsbToRgbString } from '@/utils/color';
import { normalizedHueErrorDeg } from '@/utils/scoring';

const rememberSliderTint = {
  minimumTrackTintColor: themeColors.accent.DEFAULT,
  maximumTrackTintColor: themeColors.slider.trackMax,
  thumbTintColor: themeColors.text.primary,
} as const;

type Nav = NativeStackNavigationProp<RootStackParamList, 'RememberColor'>;

export function RememberColorScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const remember = useAppSelector(s => s.game.remember);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);

  const [previewLeft, setPreviewLeft] = useState(PREVIEW_DURATION_SEC);

  useEffect(() => {
    dispatch(startRememberColor());
  }, [dispatch]);

  useEffect(() => {
    if (!remember || remember.phase !== 'preview') {
      return;
    }
    setPreviewLeft(PREVIEW_DURATION_SEC);
    let left = PREVIEW_DURATION_SEC;
    const id = setInterval(() => {
      left -= 1;
      setPreviewLeft(left);
      if (left <= 0) {
        clearInterval(id);
        dispatch(setRememberPhase('guess'));
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preview only when round/phase change
  }, [remember?.round, remember?.phase, dispatch]);

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

  if (!remember) {
    return (
      <ErrorBoundary>
        <SafeAreaView className="flex-1 bg-surface" />
      </ErrorBoundary>
    );
  }

  const deltaH =
    remember.phase === 'result' && remember.lastResultScore !== null
      ? Math.round(
          normalizedHueErrorDeg(remember.target.h, remember.guess.h) * 180,
        )
      : 0;
  const deltaS =
    remember.phase === 'result' && remember.lastResultScore !== null
      ? Math.round(Math.abs(remember.target.s - remember.guess.s))
      : 0;
  const deltaB =
    remember.phase === 'result' && remember.lastResultScore !== null
      ? Math.round(Math.abs(remember.target.b - remember.guess.b))
      : 0;

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-4 pt-2">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Leave game"
              onPress={() => {
                dispatch(endRememberSession());
                navigation.navigate('Home');
              }}
              className="min-h-[44px] min-w-[44px] justify-center">
              <Text className="text-text-secondary">← Home</Text>
            </Pressable>
            <View className="items-end">
              <Text className="text-text-secondary">Session</Text>
              <Text className="text-xl font-bold text-text-primary">
                {remember.sessionScore}
              </Text>
            </View>
          </View>

          <Text className="mb-2 text-center text-text-muted">
            Round {remember.round}
          </Text>

          {remember.phase === 'preview' && (
            <View className="mb-6 items-center">
              <Text className="mb-4 text-center text-lg text-text-primary">
                Memorize this color
              </Text>
              <View
                className="h-48 w-full max-w-[320px] rounded-xl"
                style={{ backgroundColor: targetPreview }}
              />
              <Text className="mt-4 text-text-secondary">
                {previewLeft > 0 ? `${previewLeft}s` : '…'}
              </Text>
            </View>
          )}

          {remember.phase === 'guess' && (
            <>
              <Text className="mb-4 text-center text-text-secondary">
                Match the color — no numbers, just your eyes.
              </Text>
              <View
                className="mx-auto mb-6 h-48 w-full max-w-[320px] rounded-xl"
                style={{ backgroundColor: guessPreview }}
              />
              <View className="mb-3">
                <Text className="mb-1 text-text-muted">Hue</Text>
                <HueSpectrumSlider
                  accessibilityLabel="Hue slider"
                  value={remember.guess.h}
                  onValueChange={v => dispatch(updateGuess({ h: v }))}
                />
              </View>
              <View className="mb-3">
                <Text className="mb-1 text-text-muted">Saturation</Text>
                <Slider
                  {...rememberSliderTint}
                  accessibilityLabel="Saturation slider"
                  minimumValue={0}
                  maximumValue={100}
                  value={remember.guess.s}
                  onValueChange={v => dispatch(updateGuess({ s: v }))}
                />
              </View>
              <View className="mb-6">
                <Text className="mb-1 text-text-muted">Brightness</Text>
                <Slider
                  {...rememberSliderTint}
                  accessibilityLabel="Brightness slider"
                  minimumValue={0}
                  maximumValue={100}
                  value={remember.guess.b}
                  onValueChange={v => dispatch(updateGuess({ b: v }))}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Submit guess"
                onPress={() => dispatch(submitRememberGuess())}
                className="min-h-[56px] items-center justify-center rounded-xl bg-accent py-4">
                <Text className="text-lg font-semibold text-white">Submit</Text>
              </Pressable>
            </>
          )}

          {remember.phase === 'result' && remember.lastResultScore !== null && (
            <View className="flex-1">
              <Text className="mb-4 text-center text-2xl font-bold text-text-primary">
                {remember.lastResultScore}% match
              </Text>
              <View className="mb-4 flex-row justify-center gap-4">
                <View className="items-center">
                  <Text className="mb-2 text-xs text-text-muted">Target</Text>
                  <View
                    className="h-24 w-28 rounded-xl"
                    style={{ backgroundColor: targetPreview }}
                  />
                </View>
                <View className="items-center">
                  <Text className="mb-2 text-xs text-text-muted">Yours</Text>
                  <View
                    className="h-24 w-28 rounded-xl"
                    style={{ backgroundColor: guessPreview }}
                  />
                </View>
              </View>
              <Text className="mb-6 text-center text-sm text-text-secondary">
                Δ Hue ~{deltaH}° · Δ S {deltaS} · Δ B {deltaB}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next round"
                onPress={() => dispatch(nextRememberRound())}
                className="mb-3 min-h-[56px] items-center justify-center rounded-xl bg-accent py-4">
                <Text className="text-lg font-semibold text-white">
                  Next round
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="End session"
                onPress={() => {
                  const total = remember.sessionScore;
                  const lastRound = remember.lastResultScore ?? 0;
                  const wasNew = total > bestRemember;
                  dispatch(
                    considerBestScore({ mode: 'rememberColor', score: total }),
                  );
                  dispatch(endRememberSession());
                  navigation.replace('Result', {
                    mode: 'rememberColor',
                    score: total,
                    isNewBest: wasNew,
                    lastRoundScore: lastRound,
                  });
                }}
                className="min-h-[48px] items-center justify-center rounded-xl bg-surface-elevated py-3">
                <Text className="font-medium text-text-primary">
                  End session
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
