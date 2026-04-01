import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { RootStackParamList } from '@/navigation/types';
import { resetSettings, setHapticsEnabled, setSoundEnabled } from '@/store/slices/settingsSlice';
import { resetStats } from '@/store/slices/statsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const soundEnabled = useAppSelector(s => s.settings.soundEnabled);
  const hapticsEnabled = useAppSelector(s => s.settings.hapticsEnabled);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6 pt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            className="mb-8 min-h-[44px] self-start justify-center">
            <Text className="text-accent">← Back</Text>
          </Pressable>

          <Text className="mb-2 text-2xl font-bold text-text-primary">
            Settings
          </Text>
          <Text className="mb-8 text-sm text-text-secondary">
            Coloryx depends on color perception. If you have difficulty
            distinguishing subtle differences, try a brighter screen or take
            breaks.
          </Text>

          <View className="mb-4 flex-row items-center justify-between rounded-xl bg-surface-card px-4 py-3">
            <Text className="text-text-primary">Sound</Text>
            <Switch
              accessibilityLabel="Toggle sound"
              value={soundEnabled}
              onValueChange={v => {
                dispatch(setSoundEnabled(v));
              }}
            />
          </View>

          <View className="mb-8 flex-row items-center justify-between rounded-xl bg-surface-card px-4 py-3">
            <Text className="text-text-primary">Haptics</Text>
            <Switch
              accessibilityLabel="Toggle haptics"
              value={hapticsEnabled}
              onValueChange={v => {
                dispatch(setHapticsEnabled(v));
              }}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset local progress"
            onPress={() => {
              dispatch(resetStats());
              dispatch(resetSettings());
            }}
            className="min-h-[48px] items-center justify-center rounded-xl border border-red-500/40 py-3">
            <Text className="font-medium text-red-400">Reset local progress</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
