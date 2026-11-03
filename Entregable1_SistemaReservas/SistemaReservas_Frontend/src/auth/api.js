import { api } from '@/services/api';

export function login(email, password) {
  return api('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function registrar(data) {
  return api('/auth/registro', {
    method: 'POST',
    body: data,
  });
}
