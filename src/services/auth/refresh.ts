import { buildApiUrl } from '@/services/api/baseUrl';
import { clearAuthTokens, getRefreshToken, setAuthTokens } from '@/services/auth/tokens';

type RefreshResult = { accessToken: string; refreshToken: string };

let refreshPromise: Promise<RefreshResult | null> | null = null;

function isRefreshResult(value: unknown): value is RefreshResult {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.accessToken === 'string' && typeof v.refreshToken === 'string';
}

export async function refreshAuthTokens(): Promise<RefreshResult | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch(buildApiUrl('/v1/auth/refresh'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await clearAuthTokens();
      return null;
    }

    const data: unknown = await res.json().catch(() => null);
    if (!isRefreshResult(data)) {
      await clearAuthTokens();
      return null;
    }

    await setAuthTokens(data);
    return data;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

