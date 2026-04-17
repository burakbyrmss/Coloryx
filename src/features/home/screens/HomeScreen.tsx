import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RootStackParamList } from '@/navigation/types';
import { useGetPing } from '@/services/api';
import { useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const bestRemember = useAppSelector(s => s.stats.bestRememberColor);
  const pingQuery = useGetPing({ query: { enabled: false } });

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

          <View className="mb-4 rounded-2xl bg-surface-elevated px-4 py-4">
            <View className="flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text className="text-base font-semibold text-text-primary">
                  API test
                </Text>
                <Text className="mt-1 text-sm text-text-secondary">
                  /ping (expects 200)
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel="Test API ping endpoint"
                onPress={() => pingQuery.refetch()}
                className="min-h-[44px] items-center justify-center rounded-xl bg-surface px-4">
                {pingQuery.isFetching ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-text-secondary">Test</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-3">
              {pingQuery.isError ? (
                <Text className="text-sm text-danger">
                  Failed:{' '}
                  {pingQuery.error instanceof Error
                    ? pingQuery.error.message
                    : 'Unknown error'}
                </Text>
              ) : pingQuery.data ? (
                <Text className="text-sm text-text-secondary">
                  OK (status {pingQuery.data.status})
                </Text>
              ) : (
                <Text className="text-sm text-text-muted">
                  Press “Test” to call the API.
                </Text>
              )}
            </View>
          </View>

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
