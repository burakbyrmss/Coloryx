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

import { RootNavigator } from '@/navigation/RootNavigator';
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
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" />
            <RootNavigator />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
