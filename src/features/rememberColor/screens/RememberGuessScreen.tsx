import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HSBSlider, type HSBStripKind } from '@/components/HSBSlider';
import {
  rememberCardElevated,
  RememberSessionHeader,
  prefersDarkTextOnHsb,
  stripControlLabel,
  formatRememberRoundIndicator,
} from '@/features/rememberColor/rememberShared';
import type { RootStackParamList } from '@/navigation/types';
import {
  endRememberSession,
  submitRememberGuess,
  updateGuess,
} from '@/store/slices/gameSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hsbToRgbString } from '@/utils/color';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RememberGuess'>;

export function RememberGuessScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const remember = useAppSelector(s => s.game.remember);

  const [activeStrip, setActiveStrip] = useState<HSBStripKind | null>(null);

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
      if (remember.phase === 'result') {
        navigation.replace('RememberRoundResult');
      }
    }, [remember, navigation]),
  );

  useEffect(() => {
    setActiveStrip(null);
  }, [remember?.round, remember?.phase]);

  const guessPreview = useMemo(() => {
    if (!remember) {
      return 'rgb(128,128,128)';
    }
    const { h, s, b } = remember.guess;
    return hsbToRgbString(h, s, b);
  }, [remember]);

  if (!remember || remember.phase !== 'guess') {
    return (
      <ErrorBoundary>
        <SafeAreaView className="flex-1 bg-surface" />
      </ErrorBoundary>
    );
  }

  const guessDarkText = prefersDarkTextOnHsb(remember.guess);
  const guessMetaCls = guessDarkText ? 'text-black/90' : 'text-white';

  const onLeave = () => {
    dispatch(endRememberSession());
    navigation.replace('Home');
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
              <View
                className="relative min-h-[200px] flex-1"
                style={{ backgroundColor: guessPreview }}>
                <View className="absolute left-4 top-4 z-10">
                  <Text className={`text-lg font-semibold ${guessMetaCls}`}>
                    {formatRememberRoundIndicator(remember.round)}
                  </Text>
                </View>
                <View className="absolute bottom-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pb-4 pt-2">
                  <View className="min-w-0 flex-1 pr-3">
                    {activeStrip !== null ? (
                      <Text
                        className={`text-lg font-semibold ${guessMetaCls}`}
                        numberOfLines={1}>
                        {stripControlLabel(activeStrip)}
                      </Text>
                    ) : null}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Submit guess"
                    onPress={() => {
                      dispatch(submitRememberGuess());
                      navigation.replace('RememberRoundResult');
                    }}
                    className="h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white"
                    style={rememberCardElevated.fab}>
                    <Text className="text-2xl">→</Text>
                  </Pressable>
                </View>
              </View>
              <HSBSlider
                onActiveStripChange={setActiveStrip}
                value={remember.guess}
                onChange={patch => dispatch(updateGuess(patch))}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
