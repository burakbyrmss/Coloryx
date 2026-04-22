import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import themeColors from '@/theme/colors.json';

interface FullscreenActivityOverlayProps {
  visible: boolean;
}

export function FullscreenActivityOverlay({
  visible,
}: FullscreenActivityOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
      <ActivityIndicator size="large" color={themeColors.accent.DEFAULT} />
    </View>
  );
}
