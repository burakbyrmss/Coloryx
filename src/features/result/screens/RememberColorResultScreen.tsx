import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DiagonalSplitSquare } from '@/components/DiagonalSplitSquare';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { usePostV1Scores } from '@/services/api';
import { REMEMBER_SESSION_MAX } from '@/utils/scoring';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RememberColorResult'>;
type R = RouteProp<RootStackParamList, 'RememberColorResult'>;

function formatRememberTotal(score: number): string {
  return score.toFixed(1);
}

export function RememberColorResultScreen() {
  const navigation = useNavigation<Nav>();
  const { score, isNewBest, rememberRoundHistory, rememberSessionMax } =
    useRoute<R>().params;
  const { mutateAsync: submitScore } = usePostV1Scores();
  const didSubmitRef = React.useRef(false);

  const sessionCap = rememberSessionMax ?? REMEMBER_SESSION_MAX;
  const showNewBest = Boolean(isNewBest);
  const rounds = rememberRoundHistory ?? [];

  const { width: windowWidth } = useWindowDimensions();
  const horizontalPad = 24 * 2;
  const gap = 8;
  const rememberCardSize = Math.max(
    44,
    Math.floor((windowWidth - horizontalPad - gap * 4) / 5),
  );

  React.useEffect(() => {
    if (didSubmitRef.current) {
      return;
    }
    didSubmitRef.current = true;

    void submitScore({
      data: {
        mode: 'REMEMBER_COLOR',
        score,
      },
    }).catch(error => {
      console.warn('[RememberColorResultScreen] score submit failed', error);
    });
  }, [score, submitScore]);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 px-6 pb-8 pt-2">
          <View className="flex-row justify-end">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('close')}
              onPress={() => navigation.replace('Home')}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Text className="text-lg text-white">✕</Text>
            </Pressable>
          </View>

          <View className="items-center pt-2">
            <Text className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              {t('results')}
            </Text>
            <View className="mt-2 flex-row items-baseline">
              <Text className="text-6xl font-bold text-white">
                {formatRememberTotal(score)}
              </Text>
              <Text className="text-2xl font-semibold text-neutral-500">
                /{sessionCap}
              </Text>
            </View>
            <Text className="mt-4 max-w-[320px] text-center text-base leading-6 text-white">
              {t('rememberQuote')}
            </Text>
          </View>

          <View className="mt-10 flex-row justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const r = rounds[i];
              if (!r) {
                return (
                  <View
                    key={i}
                    className="rounded-xl bg-neutral-800"
                    style={{
                      width: rememberCardSize,
                      height: rememberCardSize,
                    }}
                  />
                );
              }
              return (
                <DiagonalSplitSquare
                  key={i}
                  target={r.target}
                  guess={r.guess}
                  pointsLabel={r.points.toFixed(1)}
                  size={rememberCardSize}
                />
              );
            })}
          </View>

          {showNewBest ? (
            <View className="mt-8 rounded-2xl bg-neutral-900 py-4">
              <Text className="text-center text-base font-bold uppercase tracking-wide text-emerald-400">
                {t('newPersonalBest')}
              </Text>
            </View>
          ) : null}

          <View className="mt-auto pt-6">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('playAgain')}
              onPress={() => navigation.replace('Home')}
              className="min-h-[56px] items-center justify-center rounded-full bg-home-remember-bright py-4">
              <Text className="text-lg font-semibold text-black">
                {t('playAgain')}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
