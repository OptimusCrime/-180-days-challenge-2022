import {getToken} from "./utilities/localStorage";
import {TOKEN_HEADER_NAME} from "./constants";

const domain = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8098'
  : 'https://180-2024.optimuscrime.net';

export class BackendException extends Error {}

const httpInit = async(url: string, init?: RequestInit) =>
  await fetch(`${domain}${url}`, init);

const httpJson = async(url: string, init?: RequestInit) =>
  await httpInit(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    }
  })

export const withAuth = async (init?: RequestInit): Promise<RequestInit> => ({
    ...init,
    headers: {
      ...init?.headers,
      [TOKEN_HEADER_NAME]: getToken() || ''
    }
})

export const httpOk = async (url: string, init?: RequestInit): Promise<boolean> => {
  const response = await httpInit(url, init);
  return response.ok;
}

export const http = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await httpJson(url, init);

  if (!response.ok) {
    throw new BackendException();
  }

  try {
    return await response.json() as Promise<T>;
  }
  catch (ex) {
    throw new BackendException();
  }
}
