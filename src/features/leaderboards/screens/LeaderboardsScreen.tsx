import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import {
  useGetV1LeaderboardAroundMe,
  useGetV1Leaderboards,
  useGetV1LeaderboardsMe,
} from '@/services/api';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Leaderboards'>;
type LeaderboardMode = 'ODD_ONE_OUT' | 'REMEMBER_COLOR';
type LeaderboardView = 'GLOBAL' | 'AROUND_ME';

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
  const [view, setView] = React.useState<LeaderboardView>('GLOBAL');

  const oddQuery = useGetV1Leaderboards({
    mode: 'ODD_ONE_OUT',
    limit: 10,
  });
  const oddMeQuery = useGetV1LeaderboardsMe({
    mode: 'ODD_ONE_OUT',
  });
  const rememberQuery = useGetV1Leaderboards({
    mode: 'REMEMBER_COLOR',
    limit: 10,
  });
  const rememberMeQuery = useGetV1LeaderboardsMe({
    mode: 'REMEMBER_COLOR',
  });

  const activeQuery = mode === 'ODD_ONE_OUT' ? oddQuery : rememberQuery;
  const activeMeQuery = mode === 'ODD_ONE_OUT' ? oddMeQuery : rememberMeQuery;
  const currentUserId = activeMeQuery.data?.data.userId;
  const oddAroundMeQuery = useGetV1LeaderboardAroundMe(
    {
      mode: 'ODD_ONE_OUT',
      userId: currentUserId ?? '',
    },
    {
      query: {
        enabled: Boolean(currentUserId),
      },
    },
  );
  const rememberAroundMeQuery = useGetV1LeaderboardAroundMe(
    {
      mode: 'REMEMBER_COLOR',
      userId: currentUserId ?? '',
    },
    {
      query: {
        enabled: Boolean(currentUserId),
      },
    },
  );
  const activeAroundMeQuery =
    mode === 'ODD_ONE_OUT' ? oddAroundMeQuery : rememberAroundMeQuery;
  const activeRowsQuery = view === 'AROUND_ME' ? activeAroundMeQuery : activeQuery;
  const rows = activeRowsQuery.data?.data.items ?? [];

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
                oddQuery.refetch().catch(() => undefined);
                oddMeQuery.refetch().catch(() => undefined);
                rememberQuery.refetch().catch(() => undefined);
                rememberMeQuery.refetch().catch(() => undefined);
                if (currentUserId) {
                  oddAroundMeQuery.refetch().catch(() => undefined);
                  rememberAroundMeQuery.refetch().catch(() => undefined);
                }
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
          <View className="mt-3 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('showGlobalLeaderboard')}
              onPress={() => setView('GLOBAL')}
              className={`min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-2 ${
                view === 'GLOBAL' ? 'bg-surface-elevated' : 'bg-surface'
              }`}>
              <Text
                className={`font-semibold ${
                  view === 'GLOBAL' ? 'text-text-primary' : 'text-text-muted'
                }`}>
                {t('global')}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('findMeLeaderboard')}
              onPress={() => {
                setView('AROUND_ME');
                if (currentUserId) {
                  activeAroundMeQuery.refetch().catch(() => undefined);
                }
              }}
              className={`min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-2 ${
                view === 'AROUND_ME' ? modeSelectedBgClass(mode) : 'bg-surface-elevated'
              }`}>
              <Text
                className={`font-semibold ${
                  view === 'AROUND_ME' ? 'text-black' : 'text-text-secondary'
                }`}>
                {t('findMe')}
              </Text>
            </Pressable>
          </View>

          <ScrollView className="mt-4 flex-1" contentContainerClassName="pb-8">
            {activeRowsQuery.isLoading ? (
              <View className="mt-12 items-center">
                <ActivityIndicator />
                <Text className="mt-3 text-text-muted">
                  {t('loadingLeaderboard')}
                </Text>
              </View>
            ) : activeRowsQuery.isError ? (
              <View className="mt-12 rounded-xl bg-surface-elevated px-4 py-4">
                <Text className="font-semibold text-danger">
                  {t('failedToLoadLeaderboard')}
                </Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  {activeRowsQuery.error instanceof Error
                    ? activeRowsQuery.error.message
                    : t('unknownError')}
                </Text>
              </View>
            ) : view === 'AROUND_ME' && !currentUserId ? (
              <View className="mt-12 rounded-xl bg-surface-elevated px-4 py-4">
                <Text className="font-semibold text-text-primary">
                  {t('findMeUnavailable')}
                </Text>
              </View>
            ) : rows.length === 0 ? (
              <View className="mt-12 rounded-xl bg-surface-elevated px-4 py-4">
                <Text className="font-semibold text-text-primary">
                  {view === 'AROUND_ME' ? t('noNearbyScores') : t('noScoresYet')}
                </Text>
                <Text className="mt-2 text-sm text-text-secondary">
                  {view === 'AROUND_ME' ? t('tryAgainLater') : t('beFirstScore')}
                </Text>
              </View>
            ) : (
              rows.map(item => (
                <View
                  key={`${item.userId}-${item.rank}`}
                  className="mb-2 flex-row items-center rounded-xl bg-surface-elevated px-4 py-3">
                  <Text className="w-8 text-base font-semibold text-text-primary">
                    {item.rank}
                  </Text>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm text-text-muted">{t('player')}</Text>
                    <Text
                      numberOfLines={1}
                      className="text-base font-semibold text-text-primary">
                      {`${getLeaderboardDisplayName(
                        item as { name?: string; [key: string]: unknown },
                      )}${item.userId === currentUserId ? ' (you)' : ''}`}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-text-muted">{t('best')}</Text>
                    <Text className={`text-lg font-bold ${modeAccentTextClass(mode)}`}>
                      {item.bestScore}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
