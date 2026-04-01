import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type R = RouteProp<RootStackParamList, 'Result'>;

function rememberTier(score: number): string {
  if (score >= 90) {
    return 'Excellent';
  }
  if (score >= 75) {
    return 'Great';
  }
  if (score >= 50) {
    return 'Good';
  }
  return 'Try again';
}

export function ResultScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const { mode, score, isNewBest, lastRoundScore } = route.params;

  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);

  const best = mode === 'oddOneOut' ? bestOdd : bestRemember;

  const tier = useMemo(() => {
    if (mode !== 'rememberColor' || lastRoundScore === undefined) {
      return null;
    }
    return rememberTier(lastRoundScore);
  }, [mode, lastRoundScore]);

  const showNewBest = Boolean(isNewBest);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 justify-between px-6 pb-8 pt-4">
          <View className="items-center pt-8">
            <Text className="mb-2 text-2xl font-bold text-text-primary">
              {mode === 'oddOneOut' ? 'Run over' : 'Session complete'}
            </Text>
            <Text className="mb-6 text-5xl font-bold text-accent">{score}</Text>
            {showNewBest && (
              <Text className="mb-4 text-center text-lg font-semibold text-text-primary">
                New best for this mode
              </Text>
            )}
            {tier && (
              <Text className="mb-4 text-center text-text-secondary">{tier}</Text>
            )}
            <Text className="text-text-muted">
              Best ({mode === 'oddOneOut' ? 'Odd one out' : 'Remember'}): {best}
            </Text>
          </View>

          <View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Play again"
              onPress={() => navigation.replace('Home')}
              className="mb-3 min-h-[56px] items-center justify-center rounded-xl bg-accent py-4">
              <Text className="text-lg font-semibold text-white">Play again</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              onPress={() => navigation.navigate('Home')}
              className="min-h-[48px] items-center justify-center rounded-xl bg-surface-elevated py-3">
              <Text className="font-medium text-text-primary">Home</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
