import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

export function guardarToken(token: string) {
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export function leerToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export function borrarToken() {
  return AsyncStorage.removeItem(TOKEN_KEY);
}
