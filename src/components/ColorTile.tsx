import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { t } from '@/i18n';
import { hsbToRgbString } from '@/utils/color';

export interface ColorTileProps {
  index: number;
  hue: number;
  saturation: number;
  brightness: number;
  feedback: 'none' | 'pulse' | 'shake';
  onPress: (index: number) => void;
  disabled: boolean;
  /** When set, draws a border (e.g. mark the correct odd tile on result screen). */
  highlightBorder?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ColorTile({
  index,
  hue,
  saturation,
  brightness,
  feedback,
  onPress,
  disabled,
  highlightBorder,
}: ColorTileProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (feedback === 'pulse') {
      scale.value = withSequence(
        withSpring(1.06, { damping: 12 }),
        withSpring(1, { damping: 14 }),
      );
    } else if (feedback === 'shake') {
      translateX.value = withSequence(
        withTiming(-6, { duration: 40 }),
        withTiming(6, { duration: 40 }),
        withTiming(-4, { duration: 40 }),
        withTiming(4, { duration: 40 }),
        withTiming(0, { duration: 40 }),
      );
    }
  }, [feedback, scale, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const bg = hsbToRgbString(hue, saturation, brightness);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={t('colorTile', { index: index + 1 })}
      disabled={disabled}
      onPress={() => onPress(index)}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[{ backgroundColor: bg }, animStyle]}
      className={`h-full w-full min-h-[44px] min-w-[44px] rounded-xl ${
        highlightBorder ? 'border-2 border-accent' : ''
      }`}
    />
  );
}
