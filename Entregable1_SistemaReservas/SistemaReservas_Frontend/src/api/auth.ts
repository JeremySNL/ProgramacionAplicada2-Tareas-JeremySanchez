import { api } from './client';
import type { Rol, Usuario } from '@/types/api';

export function login(email: string, password: string) {
  return api<{ token: string }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function registrar(data: {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}) {
  return api<Usuario>('/auth/registro', {
    method: 'POST',
    body: data,
  });
}
