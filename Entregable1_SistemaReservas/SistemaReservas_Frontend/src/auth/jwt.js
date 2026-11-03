import { jwtDecode } from 'jwt-decode';

export function decodificarToken(token) {
  return jwtDecode(token);
}

export function tokenVigente(payload) {
  return payload.exp * 1000 > Date.now();
}
