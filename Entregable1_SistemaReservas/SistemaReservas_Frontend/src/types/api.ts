export type Rol = 'ADMIN' | 'CLIENTE';

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
};

export type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: string;
};

export type ServicioInput = {
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
};

export type EstadoReserva = 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';

export type Reserva = {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoReserva;
  usuarioId: number;
  servicioId: number;
  servicio: Servicio;
  usuario?: Usuario;
};

export type ReservaInput = {
  servicioId: number;
  fecha: string;
  hora: string;
};
