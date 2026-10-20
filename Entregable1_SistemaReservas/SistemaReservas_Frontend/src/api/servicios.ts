import { api } from './client';
import type { Servicio, ServicioInput } from '@/types/api';

export function listarServicios(token: string) {
  return api<Servicio[]>('/servicios', { token });
}

export function crearServicio(token: string, data: ServicioInput) {
  return api<Servicio>('/servicios', {
    method: 'POST',
    body: data,
    token,
  });
}

export function editarServicio(
  token: string,
  id: number,
  data: Partial<ServicioInput>,
) {
  return api<Servicio>(`/servicios/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export function eliminarServicio(token: string, id: number) {
  return api<Servicio>(`/servicios/${id}`, {
    method: 'DELETE',
    token,
  });
}
