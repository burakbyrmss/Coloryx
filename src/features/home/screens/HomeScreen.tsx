import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
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
        <View className="flex-1 justify-between px-6 pb-8 pt-4">
          <View className="items-end">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => navigation.navigate('Settings')}
              className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-surface-elevated px-4">
              <Text className="text-text-secondary">Settings</Text>
            </Pressable>
          </View>

          <View className="items-center">
            <Text className="mb-2 text-4xl font-bold tracking-tight text-text-primary">
              Coloryx
            </Text>
            <Text className="mb-10 text-center text-text-secondary">
              Color perception & memory
            </Text>

            <View className="mb-8 w-full rounded-xl bg-surface-card p-4">
              <Text className="mb-2 text-center text-xs uppercase tracking-wide text-text-muted">
                Best scores
              </Text>
              <Text className="text-center text-text-primary">
                Odd one out:{' '}
                <Text className="font-semibold text-accent">{bestOdd}</Text>
              </Text>
              <Text className="mt-1 text-center text-text-primary">
                Remember:{' '}
                <Text className="font-semibold text-accent">{bestRemember}</Text>
              </Text>
            </View>

            <Text className="mb-2 w-full text-center text-2xl font-bold text-text-primary">
              Choose mode
            </Text>
            <Text className="mb-4 w-full text-center text-text-secondary">
              Pick how you want to play.
            </Text>
          </View>

          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Odd one out mode"
              onPress={() => navigation.navigate('OddOneOut')}
              className="mb-4 min-h-[56px] justify-center rounded-xl bg-surface-card px-4 py-4">
              <Text className="text-lg font-semibold text-text-primary">
                Odd one out
              </Text>
              <Text className="mt-1 text-sm text-text-secondary">
                Find the tile with a different saturation.
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remember the color mode"
              onPress={() => navigation.navigate('RememberColor')}
              className="min-h-[56px] justify-center rounded-xl bg-surface-card px-4 py-4">
              <Text className="text-lg font-semibold text-text-primary">
                Remember the color
              </Text>
              <Text className="mt-1 text-sm text-text-secondary">
                Memorize, then match with sliders.
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
