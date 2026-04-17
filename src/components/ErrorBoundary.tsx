import React, { type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { t } from '@/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : t('somethingWentWrong');
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (__DEV__) {
      console.warn('ErrorBoundary', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-surface px-6">
          <Text className="mb-2 text-center text-lg font-semibold text-text-primary">
            {t('somethingWentWrong')}
          </Text>
          <Text className="mb-6 text-center text-text-secondary">
            {this.state.message}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('tryAgain')}
            onPress={this.handleReset}
            className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-accent px-6">
            <Text className="font-semibold text-white">{t('tryAgain')}</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
