import { EstadoReserva } from "@prisma/client";

export const requerirCamposReserva = (req, res, next) => {
  const { servicioId, fechaHora } = req.body || {};

  if (servicioId === undefined || fechaHora === undefined) {
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

export const validarFechaHoraReserva = (req, res, next) => {
  const fechaHora = req.body?.fechaHora;
  if (!fechaHora) {
    return res.status(400).json({ error: "La fecha es requerida" });
  }

  const fechaConvertida = new Date(fechaHora);
  if (isNaN(fechaConvertida.getTime())) {
    return res.status(400).json({
      error: "Formato de fecha invalido",
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
