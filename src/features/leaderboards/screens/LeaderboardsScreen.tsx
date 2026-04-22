import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { useGetV1Leaderboards } from '@/services/api';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Leaderboards'>;
type LeaderboardMode = 'ODD_ONE_OUT' | 'REMEMBER_COLOR';

function modeTitle(mode: LeaderboardMode): string {
  return mode === 'ODD_ONE_OUT' ? t('oddOneOutMode') : t('rememberColorMode');
}

function modeSelectedBgClass(mode: LeaderboardMode): string {
  return mode === 'ODD_ONE_OUT' ? 'bg-leaderboard-odd' : 'bg-leaderboard-remember';
}

function modeAccentTextClass(mode: LeaderboardMode): string {
  return mode === 'ODD_ONE_OUT' ? 'text-leaderboard-odd' : 'text-leaderboard-remember';
}

function getLeaderboardDisplayName(item: {
  name?: string;
  [key: string]: unknown;
}): string {
  if (typeof item.name === 'string' && item.name.trim().length > 0) {
    return item.name.trim();
  }
  return '-';
}

export function LeaderboardsScreen() {
  const navigation = useNavigation<Nav>();
  const [mode, setMode] = React.useState<LeaderboardMode>('ODD_ONE_OUT');

  const oddQuery = useGetV1Leaderboards({
    mode: 'ODD_ONE_OUT',
    limit: 10,
  });
  const rememberQuery = useGetV1Leaderboards({
    mode: 'REMEMBER_COLOR',
    limit: 10,
  });

  const activeQuery = mode === 'ODD_ONE_OUT' ? oddQuery : rememberQuery;
  const rows = activeQuery.data?.data.items ?? [];

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6 pt-4">
          <View className="mb-6 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('goBack')}
              onPress={() => navigation.goBack()}
              className="min-h-[44px] justify-center">
              <Text className="text-text-primary">← {t('back')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('refreshLeaderboard')}
              onPress={() => {
                void oddQuery.refetch();
                void rememberQuery.refetch();
              }}
              className="min-h-[44px] justify-center rounded-xl bg-surface-elevated px-4">
              <Text className="text-text-secondary">{t('refresh')}</Text>
            </Pressable>
          </View>

          <Text className="text-2xl font-bold text-text-primary">
            {t('leaderboardsTitle')}
          </Text>
          <Text className="mt-2 text-sm text-text-secondary">
            {t('leaderboardsSubtitle')}
          </Text>

          <View className="mt-5 flex-row gap-2">
            {(['ODD_ONE_OUT', 'REMEMBER_COLOR'] as const).map(value => {
              const selected = mode === value;
              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={t('showModeLeaderboard', {
                    mode: modeTitle(value),
                  })}
                  onPress={() => setMode(value)}
                  className={`min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-3 ${
                    selected ? modeSelectedBgClass(value) : 'bg-surface-elevated'
                  }`}>
                  <Text
                    className={`font-semibold ${
                      selected ? 'text-black' : 'text-text-secondary'
                    }`}>
                    {modeTitle(value)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView className="mt-4 flex-1" contentContainerClassName="pb-8">
            {activeQuery.isLoading ? (
              <View className="mt-12 items-center">
                <ActivityIndicator />
                <Text className="mt-3 text-text-muted">
                  {t('loadingLeaderboard')}
                </Text>
              </View>
            ) : activeQuery.isError ? (
              <View className="mt-12 rounded-xl bg-surface-elevated px-4 py-4">
                <Text className="font-semibold text-danger">
                  {t('failedToLoadLeaderboard')}
                </Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  {activeQuery.error instanceof Error
                    ? activeQuery.error.message
                    : t('unknownError')}
                </Text>
              </View>
            ) : rows.length === 0 ? (
              <View className="mt-12 rounded-xl bg-surface-elevated px-4 py-4">
                <Text className="font-semibold text-text-primary">
                  {t('noScoresYet')}
                </Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  {t('beFirstScore')}
                </Text>
              </View>
            ) : (
              rows.map((item, index) => (
                <View
                  key={`${item.userId}-${item.updatedAt}`}
                  className="mb-2 flex-row items-center rounded-xl bg-surface-elevated px-4 py-3">
                  <Text className="w-8 text-base font-semibold text-text-primary">
                    {index + 1}
                  </Text>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm text-text-muted">{t('player')}</Text>
                    <Text
                      numberOfLines={1}
                      className="text-base font-semibold text-text-primary">
                      {getLeaderboardDisplayName(
                        item as { name?: string; [key: string]: unknown },
                      )}
                    </Text>
                  </View>
                  <Text className={`text-lg font-bold ${modeAccentTextClass(mode)}`}>
                    {item.bestScore}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
