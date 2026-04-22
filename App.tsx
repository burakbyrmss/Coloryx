/**
 * Coloryx — color perception & memory game
 */
import './global.css';

import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';

import { DeviceRegistrationBootstrap } from '@/components/DeviceRegistrationBootstrap';
import { FullscreenActivityOverlay } from '@/components/FullscreenActivityOverlay';
import { RootNavigator } from '@/navigation/RootNavigator';
import { getV1Me } from '@/services/api';
import { ensureDeviceBootstrap } from '@/services/auth/deviceBootstrap';
import { queryClient } from '@/services/reactQuery/queryClient';
import { persistor, store } from '@/store/store';
import themeColors from '@/theme/colors.json';

const USER_NAME_MIN_LENGTH = 2;
const USER_NAME_MAX_LENGTH = 16;

function hasValidMeName(name: string | null | undefined): boolean {
  const trimmed = (name ?? '').trim();
  return (
    trimmed.length >= USER_NAME_MIN_LENGTH &&
    trimmed.length <= USER_NAME_MAX_LENGTH
  );
}

function PersistLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color={themeColors.accent.DEFAULT} />
    </View>
  );
}

function AppContent() {
  const [initialRouteName, setInitialRouteName] = React.useState<
    'NameSetup' | 'Home' | null
  >(null);
  const activeFetches = useIsFetching();
  const activeMutations = useIsMutating();
  const isGlobalLoading = activeFetches > 0 || activeMutations > 0;

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      await ensureDeviceBootstrap().catch(() => {
        // Non-blocking: /v1/me may still work after retry from DeviceRegistrationBootstrap.
      });
      if (cancelled) {
        return;
      }

      try {
        const res = await getV1Me();
        if (cancelled) {
          return;
        }
        setInitialRouteName(
          hasValidMeName(res.data.name) ? 'Home' : 'NameSetup',
        );
      } catch {
        if (!cancelled) {
          setInitialRouteName('NameSetup');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <View className="relative flex-1">
        <DeviceRegistrationBootstrap />
        <StatusBar barStyle="light-content" />
        {initialRouteName ? (
          <RootNavigator initialRouteName={initialRouteName} />
        ) : (
          <PersistLoading />
        )}
        <FullscreenActivityOverlay visible={isGlobalLoading} />
      </View>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Provider store={store}>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <AppContent />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
