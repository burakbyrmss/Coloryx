import { buildApiUrl } from '@/services/api/baseUrl';
import { refreshAuthTokens } from '@/services/auth/refresh';
import { getAccessToken } from '@/services/auth/tokens';

type OrvalFetchError = Error & {
  status?: number;
  data?: unknown;
};

async function readResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  return isJson ? await res.json().catch(() => null) : await res.text();
}

async function fetchOnce(
  url: string,
  init: RequestInit | undefined,
  accessToken: string | null,
): Promise<{ res: Response; data: unknown }> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(url, { ...init, headers });
  const data = await readResponseBody(res);
  return { res, data };
}

export async function orvalFetch<TResponse>(
  inputUrl: string,
  init?: RequestInit,
): Promise<TResponse> {
  const url = buildApiUrl(inputUrl);
  const accessToken = await getAccessToken();

  const first = await fetchOnce(url, init, accessToken);

  if (first.res.status === 401) {
    const refreshed = await refreshAuthTokens();
    if (refreshed?.accessToken) {
      const retry = await fetchOnce(url, init, refreshed.accessToken);
      if (retry.res.ok) {
        return {
          status: retry.res.status,
          data: retry.data,
          headers: retry.res.headers,
        } as TResponse;
      }

      const err: OrvalFetchError = new Error(`Request failed (${retry.res.status})`);
      err.status = retry.res.status;
      err.data = retry.data;
      throw err;
    }
  }

  if (!first.res.ok) {
    const err: OrvalFetchError = new Error(`Request failed (${first.res.status})`);
    err.status = first.res.status;
    err.data = first.data;
    throw err;
  }

  return {
    status: first.res.status,
    data: first.data,
    headers: first.res.headers,
  } as TResponse;
}

