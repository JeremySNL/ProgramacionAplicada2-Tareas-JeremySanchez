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
  /** Prisma serializa Decimal como string en JSON. */
  precio: string;
};

export type ServicioInput = {
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
};
