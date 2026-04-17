import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import {
  CountdownDigits,
  rememberCardElevated,
  RememberSessionHeader,
  prefersDarkTextOnHsb,
  formatRememberRoundIndicator,
} from '@/features/rememberColor/rememberShared';
import type { RootStackParamList } from '@/navigation/types';
import {
  PREVIEW_DURATION_SEC,
  endRememberSession,
  setRememberPhase,
  startRememberColor,
} from '@/store/slices/gameSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hsbToRgbString } from '@/utils/color';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RememberColor'>;

export function RememberColorScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const remember = useAppSelector(s => s.game.remember);

  const [previewLeft, setPreviewLeft] = useState(PREVIEW_DURATION_SEC);

  useEffect(() => {
    if (!remember) {
      dispatch(startRememberColor());
    }
  }, [dispatch, remember]);

  useFocusEffect(
    useCallback(() => {
      if (!remember) {
        return;
      }
      if (remember.phase === 'guess') {
        navigation.replace('RememberGuess');
      } else if (remember.phase === 'result') {
        navigation.replace('RememberRoundResult');
      }
    }, [remember, navigation]),
  );

  useEffect(() => {
    if (!remember || remember.phase !== 'preview') {
      return;
    }
    setPreviewLeft(PREVIEW_DURATION_SEC);
    let left = PREVIEW_DURATION_SEC;
    const id = setInterval(() => {
      left -= 1;
      setPreviewLeft(left);
      if (left <= 0) {
        clearInterval(id);
        dispatch(setRememberPhase('guess'));
        navigation.replace('RememberGuess');
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preview timer tied to round/phase
  }, [remember?.round, remember?.phase, dispatch, navigation]);

  const targetPreview = useMemo(() => {
    if (!remember) {
      return 'rgb(128,128,128)';
    }
    const { h, s, b } = remember.target;
    return hsbToRgbString(h, s, b);
  }, [remember]);

  if (!remember || remember.phase !== 'preview') {
    return (
      <ErrorBoundary>
        <SafeAreaView className="flex-1 bg-surface" />
      </ErrorBoundary>
    );
  }

  const previewDarkText = prefersDarkTextOnHsb(remember.target);
  const previewMetaCls = previewDarkText ? 'text-black/90' : 'text-white';

  const onLeave = () => {
    dispatch(endRememberSession());
    navigation.replace('Home');
  };

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-4 pt-2 pb-20">
          <RememberSessionHeader onLeave={onLeave} />

          <View className="mt-1 min-h-0 flex-1">
            <View
              className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl"
              style={[
                rememberCardElevated.wrap,
                { backgroundColor: targetPreview },
              ]}>
              <View className="absolute left-4 top-4 z-10">
                <Text className={`text-lg font-semibold ${previewMetaCls}`}>
                  {formatRememberRoundIndicator(remember.round)}
                </Text>
              </View>
              <View className="absolute right-4 top-4 z-10 items-end">
                <CountdownDigits
                  value={previewLeft}
                  darkBg={previewDarkText}
                />
                <Text
                  className={`mt-1 text-right text-sm ${previewMetaCls} opacity-90`}>
                  {t('secondsToRemember')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
