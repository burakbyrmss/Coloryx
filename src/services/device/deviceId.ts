import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_STORAGE_KEY = 'coloryx.deviceId';

function createDeviceId(): string {
  // Needs to be stable per install and at least 8 chars (API contract).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const next = createDeviceId();
  await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, next);
  return next;
}

