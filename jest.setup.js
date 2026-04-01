/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = View;
  const Mock = { Svg, Polygon: View, Circle: View, Rect: View, Path: View };
  return { __esModule: true, default: Svg, ...Mock };
});

jest.mock('react-native-reanimated', () => {
  const { View, Pressable } = require('react-native');
  return {
    __esModule: true,
    default: {
      View,
      Pressable,
      createAnimatedComponent: (c: unknown) => c,
    },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (fn: () => object) => {
      try {
        return fn();
      } catch {
        return {};
      }
    },
    withSpring: (v: number) => v,
    withSequence: (...args: unknown[]) => args[0],
    withTiming: (v: number) => v,
  };
});
