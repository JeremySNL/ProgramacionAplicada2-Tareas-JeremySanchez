import { api } from './client';
import type { EstadoReserva, Reserva, ReservaInput } from '@/types/api';

export function crearReserva(token: string, data: ReservaInput) {
  return api<Reserva>('/reservas', {
    method: 'POST',
    body: data,
    token,
  });
}

export function listarMisReservas(token: string) {
  return api<Reserva[]>('/reservas/mis-reservas', { token });
}

export function listarReservas(token: string) {
  return api<Reserva[]>('/reservas', { token });
}

export function cambiarEstadoReserva(
  token: string,
  id: number,
  estado: EstadoReserva,
) {
  return api<Reserva>(`/reservas/${id}/estado`, {
    method: 'PUT',
    body: { estado },
    token,
  });
}

export function cancelarReserva(token: string, id: number) {
  return api<Reserva>(`/reservas/${id}`, {
    method: 'DELETE',
    token,
  });
}
