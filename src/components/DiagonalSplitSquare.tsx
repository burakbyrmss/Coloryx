import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { hsbToRgbString } from '@/utils/color';
import type { HSB } from '@/types/hsb';

type Props = {
  target: HSB;
  guess: HSB;
  pointsLabel: string;
  size?: number;
};

/**
 * Square split by diagonal (0,0)→(w,h): upper-right = target, lower-left = guess.
 */
export function DiagonalSplitSquare({
  target,
  guess,
  pointsLabel,
  size = 64,
}: Props) {
  const c1 = hsbToRgbString(target.h, target.s, target.b);
  const c2 = hsbToRgbString(guess.h, guess.s, guess.b);
  const w = size;
  const h = size;

  console.log('target', target);
  console.log('guess', guess);
  console.log('pointsLabel', pointsLabel);
  console.log('size', size);

  return (
    <View className="overflow-hidden rounded-xl" style={{ width: w, height: h }}>
      <Svg width={w} height={h}>
        {/* Diagonal top-left → bottom-right: upper-right vs lower-left triangles */}
        <Polygon points={`0,0 ${w},0 ${w},${h}`} fill={c1} />
        <Polygon points={`0,0 0,${h} ${w},${h}`} fill={c2} />
      </Svg>
      <View className="absolute left-1 top-1">
        <Text
          className="text-[10px] font-semibold text-white"
          style={{
            textShadowColor: 'rgba(0,0,0,0.75)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}>
          {pointsLabel}
        </Text>
      </View>
    </View>
  );
}
