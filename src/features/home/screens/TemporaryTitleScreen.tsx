import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';

export function TemporaryTitleScreen() {
  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-8xl font-bold tracking-tight text-text-primary">
            <Text className="text-home-odd-bright">y</Text>
            <Text className="text-home-remember-bright">x</Text>
          </Text>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
