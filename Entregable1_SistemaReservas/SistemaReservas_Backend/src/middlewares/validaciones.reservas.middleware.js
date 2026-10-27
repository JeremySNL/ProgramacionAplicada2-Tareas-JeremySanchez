import { EstadoReserva } from "@prisma/client";

export const requerirCamposReserva = (req, res, next) => {
  const { servicioId, fecha, hora } = req.body || {};

  if (servicioId === undefined || fecha === undefined || hora === undefined) {
    return res.status(400).json({
      error: "Los campos servicioId, fecha y hora son obligatorios",
    });
  }
  next();
};

export const validarServicioId = (req, res, next) => {
  const servicioId = Number(req.body?.servicioId);

  if (!Number.isInteger(servicioId) || servicioId <= 0) {
    return res.status(400).json({
      error: "El servicioId debe ser un número entero positivo",
    });
  }
  next();
};

export const validarFechaReserva = (req, res, next) => {
  const fecha = req.body?.fecha;
  const fechaValida =
    typeof fecha === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
    !Number.isNaN(new Date(`${fecha}T00:00:00.000Z`).getTime()) &&
    new Date(`${fecha}T00:00:00.000Z`).toISOString().slice(0, 10) === fecha;

  if (!fechaValida) {
    return res.status(400).json({
      error: "La fecha debe tener el formato YYYY-MM-DD y ser válida",
    });
  }
  next();
};

export const validarHoraReserva = (req, res, next) => {
  const hora = req.body?.hora;

  if (typeof hora !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({
      error: "La hora debe tener el formato HH:mm",
    });
  }
  next();
};

export const validarEstadoReserva = (req, res, next) => {
  const estado =
    typeof req.body?.estado === "string"
      ? req.body.estado.toUpperCase()
      : req.body?.estado;

  if (!Object.values(EstadoReserva).includes(estado)) {
    return res.status(400).json({
      error: `Estado inválido. Opciones válidas: ${Object.values(EstadoReserva).join(", ")}`,
    });
  }
  req.body.estado = estado;
  next();
};
