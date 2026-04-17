import { Platform } from 'react-native';

import { postV1AuthDevice } from '@/services/api';
import { refreshAuthTokens } from '@/services/auth/refresh';
import { getRefreshToken, setAuthTokens } from '@/services/auth/tokens';
import { getOrCreateDeviceId } from '@/services/device/deviceId';

let inflight: Promise<void> | null = null;

/**
 * First launch: persist a client UUID, then `POST /v1/auth/device` to create/link user + device
 * and receive access + refresh tokens.
 *
 * Later launches: if a refresh token exists, refresh the access token (and rotated refresh when
 * returned). If refresh fails, fall back to device registration with the same persisted device id.
 *
 * Safe under concurrent calls / Strict Mode (single in-flight promise).
 */
export function ensureDeviceBootstrap(): Promise<void> {
  if (inflight) return inflight;

  inflight = (async () => {
    const deviceId = await getOrCreateDeviceId();

    const existingRefresh = await getRefreshToken();
    if (existingRefresh) {
      const refreshed = await refreshAuthTokens();
      if (refreshed) return;
    }

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
