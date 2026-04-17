import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { orvalFetch } from '@/services/api/orval-mutator';
import { useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type ScoreMode = 'ODD_ONE_OUT' | 'REMEMBER_COLOR';

type BestScoreResponse = {
  bestScore?: number | null;
  score?: number | null;
};

async function getBestScoreForMode(mode: ScoreMode): Promise<number | null> {
  const response = await orvalFetch<{
    status: number;
    data: BestScoreResponse;
    headers: Headers;
  }>(`/v1/scores/best/me?mode=${mode}`);

  const payload = response.data;
  if (typeof payload.bestScore === 'number') return payload.bestScore;
  if (typeof payload.score === 'number') return payload.score;
  return null;
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);
  const oddBestQuery = useQuery({
    queryKey: ['/v1/scores/best/me', 'ODD_ONE_OUT'],
    queryFn: () => getBestScoreForMode('ODD_ONE_OUT'),
  });
  const rememberBestQuery = useQuery({
    queryKey: ['/v1/scores/best/me', 'REMEMBER_COLOR'],
    queryFn: () => getBestScoreForMode('REMEMBER_COLOR'),
  });
  const bestOddValue = oddBestQuery.data ?? bestOdd;
  const bestRememberValue = rememberBestQuery.data ?? bestRemember;

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const keys = await AsyncStorage.getAllKeys();
        const entries = await Promise.all(
          keys.map(async key => {
            const value = await AsyncStorage.getItem(key);
            return [key, value] as const;
          }),
        );
        console.log(
          '[HomeScreen] AsyncStorage (all keys)',
          Object.fromEntries(entries),
        );
      })().catch(err => {
        console.warn('[HomeScreen] AsyncStorage dump failed', err);
      });
    }, []),
  );

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
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={t('openLeaderboard')}
                onPress={() => navigation.navigate('Leaderboards')}
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-surface-elevated px-4">
                <Text className="text-text-secondary">{t('leaderboard')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={t('openSettings')}
                onPress={() => navigation.navigate('Settings')}
                className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-surface-elevated px-4">
                <Text className="text-text-secondary">{t('settings')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="mb-4 text-center text-base text-text-secondary">
            {t('pickPlayMode')}
          </Text>

          <View className="min-h-0 flex-1 flex-col gap-4">
            <TouchableOpacity
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={t('oddOneOutModeA11y')}
              onPress={() => navigation.navigate('OddOneOut')}
              className="min-h-0 flex-1 justify-between rounded-2xl bg-home-odd px-6 py-6">
              <View>
                <Text className="text-2xl font-semibold text-text-primary">
                  {t('oddOneOutMode')}
                </Text>
                <Text className="mt-3 text-base leading-6 text-text-secondary">
                  {t('oddOneOutDescription')}
                </Text>
              </View>
              <Text className="text-base text-text-muted">
                {t('best')}{' '}
                <Text className="font-semibold text-text-primary">
                  {bestOddValue}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={t('rememberColorModeA11y')}
              onPress={() => navigation.navigate('RememberColor')}
              className="min-h-0 flex-1 justify-between rounded-2xl bg-home-remember px-6 py-6">
              <View>
                <Text className="text-2xl font-semibold text-text-primary">
                  {t('rememberColorMode')}
                </Text>
                <Text className="mt-3 text-base leading-6 text-text-secondary">
                  {t('rememberColorDescription')}
                </Text>
              </View>
              <Text className="text-base text-text-muted">
                {t('best')}{' '}
                <Text className="font-semibold text-text-primary">
                  {bestRememberValue.toFixed(1)}/50
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
