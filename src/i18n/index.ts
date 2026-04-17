import { NativeModules, Platform } from 'react-native';

import {
  translations,
  type SupportedLocale,
  type TranslationKey,
} from '@/i18n/translations';

function detectLocale(): SupportedLocale {
  let locale = 'en';

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings ?? {};
    locale = settings.AppleLocale ?? settings.AppleLanguages?.[0] ?? 'en';
  } else if (Platform.OS === 'android') {
    locale = NativeModules.I18nManager?.localeIdentifier ?? 'en';
  }

  return locale.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

const currentLocale = detectLocale();

function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

export function t(
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const text = translations[currentLocale][key] ?? translations.en[key] ?? key;
  return interpolate(text, vars);
}

export { currentLocale };
