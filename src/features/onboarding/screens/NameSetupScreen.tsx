import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { t } from '@/i18n';
import type { RootStackParamList } from '@/navigation/types';
import { putV1MeName } from '@/services/api';

const USER_NAME_MIN_LENGTH = 2;
const USER_NAME_MAX_LENGTH = 16;

type Nav = NativeStackNavigationProp<RootStackParamList, 'NameSetup'>;

export function NameSetupScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const trimmed = name.trim();
  const isValidLength =
    trimmed.length >= USER_NAME_MIN_LENGTH &&
    trimmed.length <= USER_NAME_MAX_LENGTH;

  const onContinue = async () => {
    if (!isValidLength || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await putV1MeName({ name: trimmed });
      navigation.replace('Home');
    } catch {
      setError(t('couldNotSaveName'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 px-6 pb-8 pt-8">
          <Text className="text-3xl font-bold tracking-tight text-text-primary">
            {t('welcomeTitlePrefix')}
            Color
            <Text className="text-home-odd-bright">y</Text>
            <Text className="text-home-remember-bright">x</Text>
            {t('welcomeTitleSuffix')}
          </Text>
          <Text className="mt-3 text-base leading-6 text-text-secondary">
            {t('chooseDisplayName')}
          </Text>

          <View className="mt-8 rounded-2xl bg-surface-elevated px-4 py-4">
            <Text className="mb-2 text-sm font-medium text-text-secondary">
              {t('nameRange', {
                min: USER_NAME_MIN_LENGTH,
                max: USER_NAME_MAX_LENGTH,
              })}
            </Text>
            <TextInput
              accessibilityLabel={t('name')}
              placeholder={t('enterYourName')}
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              autoCapitalize="words"
              textAlignVertical="center"
              value={name}
              onChangeText={setName}
              maxLength={USER_NAME_MAX_LENGTH}
              className="h-12 rounded-xl bg-surface px-4 text-base leading-6 text-text-primary"
            />
            <Text className="mt-2 text-xs text-text-muted">
              {trimmed.length}/{USER_NAME_MAX_LENGTH}
            </Text>
            {error ? <Text className="mt-2 text-sm text-danger">{error}</Text> : null}
          </View>

          <View className="mt-auto">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('continue')}
              onPress={() => {
                void onContinue();
              }}
              disabled={!isValidLength || isSaving}
              className={`min-h-[56px] items-center justify-center rounded-full py-4 ${
                !isValidLength || isSaving
                  ? 'bg-surface-elevated'
                  : 'bg-home-remember-bright'
              }`}>
              <Text
                className={`text-lg font-semibold ${
                  !isValidLength || isSaving ? 'text-text-muted' : 'text-black'
                }`}>
                {isSaving ? t('saving') : t('continue')}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
