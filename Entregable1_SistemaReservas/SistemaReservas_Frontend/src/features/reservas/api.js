import { api } from '@/services/api';

export function crearReserva(token, data) {
  return api('/reservas', {
    method: 'POST',
    body: data,
    token,
  });
}

export function listarMisReservas(token) {
  return api('/reservas/mis-reservas', { token });
}

export function listarReservas(token) {
  return api('/reservas', { token });
}

export function cambiarEstadoReserva(token, id, estado) {
  return api(`/reservas/${id}/estado`, {
    method: 'PUT',
    body: { estado },
    token,
  });
}

export function cancelarReserva(token, id) {
  return api(`/reservas/${id}`, {
    method: 'DELETE',
    token,
  });
}
