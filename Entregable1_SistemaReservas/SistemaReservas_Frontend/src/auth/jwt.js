import { jwtDecode } from 'jwt-decode';
import type { Rol } from '@/types/api';

export type TokenPayload = {
  id: number;
  email: string;
  rol: Rol;
  exp: number;
};

export function decodificarToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}

export function tokenVigente(payload: TokenPayload) {
  return payload.exp * 1000 > Date.now();
}
