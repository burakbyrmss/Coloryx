import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorTile } from '@/components/ColorTile';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { usePostV1Scores } from '@/services/api';
import { useAppSelector } from '@/store/hooks';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OddOneOutResult'>;
type R = RouteProp<RootStackParamList, 'OddOneOutResult'>;

export function OddOneOutResultScreen() {
  const navigation = useNavigation<Nav>();
  const { score, isNewBest, lastBoard } = useRoute<R>().params;
  const bestOdd = useAppSelector(s => s.stats.bestOddOneOut);
  const showNewBest = Boolean(isNewBest);
  const { mutateAsync: submitScore } = usePostV1Scores();
  const didSubmitRef = React.useRef(false);

  React.useEffect(() => {
    if (didSubmitRef.current) {
      return;
    }
    didSubmitRef.current = true;

    void submitScore({
      data: {
        mode: 'ODD_ONE_OUT',
        score,
      },
    }).catch(error => {
      console.warn('[OddOneOutResultScreen] score submit failed', error);
    });
  }, [score, submitScore]);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-between px-6 pb-8 pt-4"
          keyboardShouldPersistTaps="handled">
          <View className="items-center pt-4">
            <Text className="mb-2 text-2xl font-bold text-text-primary">
              {t('runOver')}
            </Text>
            <Text className="mb-6 text-5xl font-bold text-accent">{score}</Text>
            {showNewBest && (
              <Text className="mb-4 text-center text-lg font-semibold text-text-primary">
                {t('newBestMode')}
              </Text>
            )}
            <Text className="text-text-muted">
              {t('bestOddOneOut', { score: bestOdd })}
            </Text>

            {lastBoard ? (
              <View className="mt-8 w-full max-w-[340px]">
                <Text className="mb-3 text-center text-sm font-medium text-text-secondary">
                  {t('lastRoundOddTile')}
                </Text>
                <View className="mx-auto aspect-square w-full flex-row flex-wrap">
                  {Array.from({ length: 9 }, (_, i) => {
                    const sat =
                      i === lastBoard.oddIndex
                        ? lastBoard.oddSaturation
                        : lastBoard.baseSaturation;
                    return (
                      <View key={i} className="aspect-square w-[33.333%] p-1">
                        <ColorTile
                          index={i}
                          hue={lastBoard.baseHue}
                          saturation={sat}
                          brightness={lastBoard.baseBrightness}
                          feedback="none"
                          onPress={() => {}}
                          disabled
                          highlightBorder={i === lastBoard.oddIndex}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>

          <View className="mt-8 pb-2 pt-6">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('playAgain')}
              onPress={() => navigation.replace('Home')}
              className="min-h-[56px] items-center justify-center rounded-full bg-home-odd-bright py-4">
              <Text className="text-lg font-semibold text-black">
                {t('playAgain')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
