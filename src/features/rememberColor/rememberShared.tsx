import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HSBStripKind } from '@/components/HSBSlider';
import type { HSB } from '@/types/hsb';
import { REMEMBER_MAX_ROUNDS } from '@/utils/scoring';

export const rememberCardElevated = StyleSheet.create({
  wrap: {
    shadowColor: 'rgba(0, 0, 0, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export function formatRememberRoundIndicator(round: number): string {
  return `${round}/${REMEMBER_MAX_ROUNDS}`;
}

export function formatHsbLine(hsb: HSB): string {
  return `H${Math.round(hsb.h)} S${Math.round(hsb.s)} B${Math.round(hsb.b)}`;
}

export function prefersDarkTextOnHsb(hsb: HSB): boolean {
  return hsb.b > 56;
}

export function rememberMatchTierLabel(points: number): string {
  if (points >= 9) {
    return 'Excellent';
  }
  if (points >= 7.5) {
    return 'Great';
  }
  if (points >= 5) {
    return 'Good';
  }
  return 'Keep practicing';
}

export function formatRememberPoints(p: number): string {
  return p.toFixed(1);
}

export function stripControlLabel(k: HSBStripKind | null): string {
  if (k === 'h') {
    return 'Hue';
  }
  if (k === 's') {
    return 'Saturation';
  }
  if (k === 'b') {
    return 'Brightness';
  }
  return '';
}

export function CountdownDigits({
  value,
  darkBg,
}: {
  value: number;
  darkBg: boolean;
}) {
  const s = String(Math.max(0, value));
  const head = s[0] ?? '0';
  const tail = s.slice(1);
  const headCls = darkBg ? 'text-black/95' : 'text-white';
  const tailCls = darkBg ? 'text-black/45' : 'text-white/55';
  return (
    <View className="flex-row items-baseline">
      <Text className={`text-5xl font-bold ${headCls}`}>{head}</Text>
      {tail.length > 0 ? (
        <Text className={`text-5xl font-bold ${tailCls}`}>{tail}</Text>
      ) : null}
    </View>
  );
}
export function RememberSessionHeader({ onLeave }: { onLeave: () => void }) {
  return (
    <View className="mb-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Leave game"
        onPress={onLeave}
        className="min-h-[44px] min-w-[44px] justify-center">
        <Text className="text-text-secondary">← Home</Text>
      </Pressable>
    </View>
  );
}

