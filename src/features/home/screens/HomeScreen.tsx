import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6 pb-8 pt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-4xl font-bold tracking-tight text-text-primary">
              Color
              <Text className="text-home-odd-bright">y</Text>
              <Text className="text-home-remember-bright">x</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => navigation.navigate('Settings')}
              className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-surface-elevated px-4">
              <Text className="text-text-secondary">Settings</Text>
            </TouchableOpacity>
          </View>

          <Text className="mb-4 text-center text-base text-text-secondary">
            Pick how you want to play.
          </Text>

          <View className="min-h-0 flex-1 flex-col gap-4">
            <TouchableOpacity
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel="Odd one out mode"
              onPress={() => navigation.navigate('OddOneOut')}
              className="min-h-0 flex-1 justify-between rounded-2xl bg-home-odd px-6 py-6">
              <View>
                <Text className="text-2xl font-semibold text-text-primary">
                  Odd one out
                </Text>
                <Text className="mt-3 text-base leading-6 text-text-secondary">
                  Find the tile with a different saturation.
                </Text>
              </View>
              <Text className="text-base text-text-muted">
                Best{' '}
                <Text className="font-semibold text-text-primary">{bestOdd}</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel="Remember the color mode"
              onPress={() => navigation.navigate('RememberColor')}
              className="min-h-0 flex-1 justify-between rounded-2xl bg-home-remember px-6 py-6">
              <View>
                <Text className="text-2xl font-semibold text-text-primary">
                  Remember the color
                </Text>
                <Text className="mt-3 text-base leading-6 text-text-secondary">
                  Memorize, then match with sliders.
                </Text>
              </View>
              <Text className="text-base text-text-muted">
                Best{' '}
                <Text className="font-semibold text-text-primary">
                  {bestRemember.toFixed(1)}/50
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
