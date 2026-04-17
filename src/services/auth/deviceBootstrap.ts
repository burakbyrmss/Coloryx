import { Platform } from 'react-native';

import { postV1AuthDevice } from '@/services/api';
import { getOrCreateDeviceId } from '@/services/device/deviceId';
import { getRefreshToken, setAuthTokens } from '@/services/auth/tokens';

let inflight: Promise<void> | null = null;

/**
 * Ensures we have auth tokens: skips network if a refresh token is already stored,
 * otherwise calls `POST /v1/auth/device` once per concurrent "bootstrap" (typically once per app open).
 * Safe if invoked from multiple places or under React Strict Mode (single in-flight promise).
 */
export function ensureDeviceBootstrap(): Promise<void> {
  if (inflight) return inflight;

  inflight = (async () => {
    const existingRefresh = await getRefreshToken();
    if (existingRefresh) return;

    const deviceId = await getOrCreateDeviceId();
    const res = await postV1AuthDevice({
      deviceId,
      platform: Platform.OS,
    });

    await setAuthTokens({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}
