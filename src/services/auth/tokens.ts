import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'coloryx.auth.accessToken';
const REFRESH_TOKEN_KEY = 'coloryx.auth.refreshToken';

type TokenCache = {
  loaded: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

let cache: TokenCache = {
  loaded: false,
  accessToken: null,
  refreshToken: null,
};

let loadPromise: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (cache.loaded) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
      ]);
      cache = {
        loaded: true,
        accessToken,
        refreshToken,
      };
    })().finally(() => {
      loadPromise = null;
    });
  }

  await loadPromise;
}

export async function getAccessToken(): Promise<string | null> {
  await ensureLoaded();
  return cache.accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  await ensureLoaded();
  return cache.refreshToken;
}

export async function setAuthTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  cache = {
    loaded: true,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };

  await Promise.all([
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function clearAuthTokens(): Promise<void> {
  cache = { loaded: true, accessToken: null, refreshToken: null };
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
  ]);
}

