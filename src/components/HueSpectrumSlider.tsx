import React, { useCallback, useMemo, useState } from 'react';
import { PanResponder, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import themeColors from '@/theme/colors.json';
import { HUE_SPECTRUM_GRADIENT_COLORS, hsbToRgbString } from '@/utils/color';

const THUMB_SIZE = 28;
const THUMB_RADIUS = THUMB_SIZE / 2;
const TRACK_HEIGHT = 40;
const GRADIENT_HEIGHT = 32;

type Props = {
  value: number;
  onValueChange: (hue: number) => void;
  accessibilityLabel?: string;
};

export function HueSpectrumSlider({
  value,
  onValueChange,
  accessibilityLabel = 'Hue',
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);

  const setHueFromX = useCallback(
    (x: number) => {
      if (trackWidth <= 0) {
        return;
      }
      const h = (x / trackWidth) * 360;
      const clamped = Math.max(0, Math.min(360, h));
      onValueChange(clamped);
    },
    [onValueChange, trackWidth],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => setHueFromX(e.nativeEvent.locationX),
        onPanResponderMove: e => setHueFromX(e.nativeEvent.locationX),
      }),
    [setHueFromX],
  );

  const thumbLeft =
    trackWidth > 0 ? (value / 360) * trackWidth - THUMB_RADIUS : 0;

  const thumbColor = hsbToRgbString(value, 100, 100);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max: 360, now: Math.round(value) }}
      className="w-full"
      style={{ paddingHorizontal: THUMB_RADIUS }}>
      <View
        className="relative w-full justify-center"
        collapsable={false}
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        style={{ height: TRACK_HEIGHT }}
        {...panResponder.panHandlers}>
        <LinearGradient
          colors={[...HUE_SPECTRUM_GRADIENT_COLORS]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{
            height: GRADIENT_HEIGHT,
            borderRadius: 8,
            width: '100%',
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: thumbLeft,
            top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_RADIUS,
            backgroundColor: thumbColor,
            borderWidth: 3,
            borderColor: themeColors.text.primary,
            shadowColor: 'rgba(0, 0, 0, 0.45)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.35,
            shadowRadius: 2,
            elevation: 3,
          }}
        />
      </View>
    </View>
  );
}
