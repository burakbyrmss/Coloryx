import React, { type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

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
      error instanceof Error ? error.message : 'Something went wrong.';
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
            Something went wrong
          </Text>
          <Text className="mb-6 text-center text-text-secondary">
            {this.state.message}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try again"
            onPress={this.handleReset}
            className="min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-accent px-6">
            <Text className="font-semibold text-white">Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
