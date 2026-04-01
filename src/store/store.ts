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

const statsPersistConfig = {
  key: 'coloryx_stats',
  storage: AsyncStorage,
};

const settingsPersistConfig = {
  key: 'coloryx_settings',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  game: gameSlice.reducer,
  stats: persistReducer(statsPersistConfig, statsSlice.reducer),
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
