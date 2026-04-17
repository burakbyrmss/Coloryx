import React, { useCallback, useMemo, useState } from 'react';
import { PanResponder, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { t } from '@/i18n';
import themeColors from '@/theme/colors.json';
import type { HSB } from '@/types/hsb';
import { HUE_SPECTRUM_GRADIENT_COLORS, hsbToRgbString } from '@/utils/color';

const THUMB_SIZE = 22;
const THUMB_R = THUMB_SIZE / 2;
const STRIP_HEIGHT = 40;

export type HSBStripKind = 'h' | 's' | 'b';

type HorizontalStripProps = {
  kind: HSBStripKind;
  hsb: HSB;
  onChange: (patch: Partial<HSB>) => void;
  accessibilityLabel: string;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
};

function HorizontalStrip({
  kind,
  hsb,
  onChange,
  accessibilityLabel,
  onInteractionStart,
  onInteractionEnd,
}: HorizontalStripProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const { h, s, b } = hsb;

  const setFromX = useCallback(
    (x: number) => {
      if (trackWidth <= 0) {
        return;
      }
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      if (kind === 'h') {
        onChange({ h: ratio * 360 });
      } else if (kind === 's') {
        onChange({ s: ratio * 100 });
      } else {
        onChange({ b: ratio * 100 });
      }
    },
    [kind, onChange, trackWidth],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => {
          onInteractionStart();
          setFromX(e.nativeEvent.locationX);
        },
        onPanResponderMove: e => setFromX(e.nativeEvent.locationX),
        onPanResponderRelease: () => {
          onInteractionEnd();
        },
        onPanResponderTerminate: () => {
          onInteractionEnd();
        },
      }),
    [setFromX, onInteractionStart, onInteractionEnd],
  );

  const rawThumbX =
    kind === 'h'
      ? (h / 360) * trackWidth
      : kind === 's'
        ? (s / 100) * trackWidth
        : (b / 100) * trackWidth;
  const thumbCenterX =
    trackWidth > 0
      ? Math.max(THUMB_R, Math.min(trackWidth - THUMB_R, rawThumbX))
      : 0;

  const gradientColors = useMemo((): string[] => {
    if (kind === 'h') {
      return [...HUE_SPECTRUM_GRADIENT_COLORS];
    }
    if (kind === 's') {
      return [hsbToRgbString(h, 0, 100), hsbToRgbString(h, 100, 100)];
    }
    return [hsbToRgbString(h, s, 0), hsbToRgbString(h, s, 100)];
  }, [kind, h, s]);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
      className="w-full">
      <View
        className="relative w-full justify-center overflow-hidden"
        collapsable={false}
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
        style={{ height: STRIP_HEIGHT }}
        {...panResponder.panHandlers}>
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0, y: 0.5 }}
          style={{
            height: STRIP_HEIGHT,
            width: '100%',
          }}
        />
        {trackWidth > 0 ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: thumbCenterX - THUMB_R,
              top: (STRIP_HEIGHT - THUMB_SIZE) / 2,
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_R,
              backgroundColor: themeColors.text.primary,
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

export type HSBSliderProps = {
  value: HSB;
  onChange: (patch: Partial<HSB>) => void;
  onActiveStripChange?: (kind: HSBStripKind | null) => void;
};

/**
 * Three horizontal strips (no gaps): hue, saturation, brightness.
 * Saturation/brightness gradients follow current hue (and S for B).
 */
export function HSBSlider({
  value,
  onChange,
  onActiveStripChange,
}: HSBSliderProps) {
  const end = useCallback(() => onActiveStripChange?.(null), [
    onActiveStripChange,
  ]);

  return (
    <View className="w-full shrink-0 flex-col">
      <HorizontalStrip
        accessibilityLabel={t('hue')}
        kind="h"
        hsb={value}
        onChange={onChange}
        onInteractionEnd={end}
        onInteractionStart={() => onActiveStripChange?.('h')}
      />
      <HorizontalStrip
        accessibilityLabel={t('saturation')}
        kind="s"
        hsb={value}
        onChange={onChange}
        onInteractionEnd={end}
        onInteractionStart={() => onActiveStripChange?.('s')}
      />
      <HorizontalStrip
        accessibilityLabel={t('brightness')}
        kind="b"
        hsb={value}
        onChange={onChange}
        onInteractionEnd={end}
        onInteractionStart={() => onActiveStripChange?.('b')}
      />
    </View>
  );
}
