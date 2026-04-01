import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

const initialState: SettingsState = {
  soundEnabled: true,
  hapticsEnabled: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
    },
    setHapticsEnabled(state, action: PayloadAction<boolean>) {
      state.hapticsEnabled = action.payload;
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const { setSoundEnabled, setHapticsEnabled, resetSettings } =
  settingsSlice.actions;
