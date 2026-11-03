import { api } from '@/services/api';

export function listarServicios(token) {
  return api('/servicios', { token });
}

export function crearServicio(token, data) {
  return api('/servicios', {
    method: 'POST',
    body: data,
    token,
  });
}

export function editarServicio(token, id, data) {
  return api(`/servicios/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export function eliminarServicio(token, id) {
  return api(`/servicios/${id}`, {
    method: 'DELETE',
    token,
  });
}
