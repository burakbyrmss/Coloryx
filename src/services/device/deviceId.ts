import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_STORAGE_KEY = 'coloryx.deviceId';

/**
 * RFC 4122 version 4 UUID. Uses `crypto.randomUUID` / `getRandomValues` when available.
 * Must stay ≥8 chars for `POST /v1/auth/device`.
 */
function createDeviceUuid(): string {
  const g = globalThis as typeof globalThis & {
    crypto?: {
      randomUUID?: () => string;
      getRandomValues?: (array: Uint8Array) => Uint8Array;
    };
  };

  if (typeof g.crypto?.randomUUID === 'function') {
    return g.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof g.crypto?.getRandomValues === 'function') {
    g.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const next = createDeviceUuid();
  await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, next);
  return next;
}

