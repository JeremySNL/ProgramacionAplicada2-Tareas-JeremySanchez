import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;
const API_URL = (
  extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function api(path, { method = 'GET', body, token } = {}) {
  if (!API_URL) {
    throw new ApiError(
      'La URL de la API no está configurada en app.config.js',
      0,
    );
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      onUnauthorized?.();
    }

    const message = data?.error ?? `Error HTTP ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return data;
}
