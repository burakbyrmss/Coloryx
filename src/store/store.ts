import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { gameSlice } from '@/store/slices/gameSlice';
import { settingsSlice } from '@/store/slices/settingsSlice';
import { statsSlice } from '@/store/slices/statsSlice';

void Promise.all([
  AsyncStorage.removeItem('coloryx_stats'),
  AsyncStorage.removeItem('persist:coloryx_stats'),
]).catch((error: unknown) => {
  console.warn('[store] failed to remove coloryx_stats from storage', error);
});

const settingsPersistConfig = {
  key: 'coloryx_settings',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  game: gameSlice.reducer,
  stats: statsSlice.reducer,
  settings: persistReducer(settingsPersistConfig, settingsSlice.reducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
