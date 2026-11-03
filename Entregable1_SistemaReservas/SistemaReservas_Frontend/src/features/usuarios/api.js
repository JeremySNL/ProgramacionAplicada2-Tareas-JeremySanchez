import { api } from '@/services/api';

export function obtenerPerfil(token) {
  return api('/usuarios/perfil', { token });
}

export function actualizarPerfil(token, nombre) {
  return api('/usuarios/perfil', {
    method: 'PUT',
    body: { nombre },
    token,
  });
}
