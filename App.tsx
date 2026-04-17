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
import { QueryClientProvider } from '@tanstack/react-query';

import { DeviceRegistrationBootstrap } from '@/components/DeviceRegistrationBootstrap';
import { RootNavigator } from '@/navigation/RootNavigator';
import { queryClient } from '@/services/reactQuery/queryClient';
import { persistor, store } from '@/store/store';
import themeColors from '@/theme/colors.json';

function PersistLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color={themeColors.accent.DEFAULT} />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Provider store={store}>
        <PersistGate loading={<PersistLoading />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <DeviceRegistrationBootstrap />
              <StatusBar barStyle="light-content" />
              <RootNavigator />
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
