const LOCAL_STORAGE_TOKEN_KEY = 'AUTH180_TOKEN';

export const setToken = (token: string): void => {
  if (window.localStorage) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  }
}

export const getToken = (): string | null => {
  if (window.localStorage) {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  return null;
}
