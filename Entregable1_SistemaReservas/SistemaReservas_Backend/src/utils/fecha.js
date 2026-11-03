// Zona horaria del negocio: UTC-4 (Atlántico, sin horario de verano).
export const UTC_OFFSET = "-04:00";

const OFFSET_MS = -4 * 60 * 60 * 1000;

// Formatea un Date en hora UTC-4, ej: 2026-11-05T10:00:00.000-04:00
export const formatearFechaAtlantico = (fecha = new Date()) =>
  new Date(fecha.getTime() + OFFSET_MS).toISOString().replace("Z", UTC_OFFSET);

const FECHA_SIN_HORA = /^\d{4}-\d{2}-\d{2}$/;
const FECHA_HORA_SIN_OFFSET = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

// Convierte a Date. Un string ISO sin offset se interpreta como hora UTC-4,
// sin depender de la zona horaria de la maquina. Devuelve null si es invalido.
export const parsearFechaHora = (valor) => {
  let entrada = valor;

  if (typeof valor === "string") {
    const texto = valor.trim();
    if (FECHA_SIN_HORA.test(texto)) {
      entrada = `${texto}T00:00:00${UTC_OFFSET}`;
    } else if (FECHA_HORA_SIN_OFFSET.test(texto)) {
      entrada = `${texto.replace(" ", "T")}${UTC_OFFSET}`;
    } else {
      entrada = texto;
    }
  }

  const fecha = new Date(entrada);
  return isNaN(fecha.getTime()) ? null : fecha;
};
