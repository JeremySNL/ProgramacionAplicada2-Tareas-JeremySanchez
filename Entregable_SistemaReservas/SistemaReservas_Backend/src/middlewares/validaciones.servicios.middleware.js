export const validarNombre = (req, res, next) => {
  const { nombre } = req.body;

  if (nombre === undefined) return next();

  if (typeof nombre !== "string") {
    return res.status(400).json({
      error: "El nombre debe ser un texto",
    });
  }

  if (nombre.trim().length === 0) {
    return res.status(400).json({
      error: "El nombre no puede estar vacío ni contener solo espacios",
    });
  }
  next();
};

export const validarDescripcion = (req, res, next) => {
  const { descripcion } = req.body;

  if (descripcion === undefined) return next();

  if (typeof descripcion !== "string") {
    return res.status(400).json({
      error: "La descripción debe ser un texto",
    });
  }

  if (descripcion.trim().length === 0) {
    return res.status(400).json({
      error: "La descripción no puede estar vacía ni contener solo espacios",
    });
  }
  next();
};

export const validarDuracion = (req, res, next) => {
  const { duracion } = req.body;

  if (duracion === undefined) return next();

  const numDuracion = Number(duracion);

  if (!Number.isInteger(numDuracion) || numDuracion <= 0) {
    return res.status(400).json({
      error: "La duración debe ser un número entero positivo (en minutos)",
    });
  }
  next();
};

export const validarPrecio = (req, res, next) => {
  const { precio } = req.body;

  if (precio === undefined) return next();

  const numPrecio = Number(precio);

  if (isNaN(numPrecio) || numPrecio < 0) {
    return res.status(400).json({
      error: "El precio debe ser un número válido igual o mayor a 0",
    });
  }
  next();
};

export const requerirCamposServicio = (req, res, next) => {
  const { nombre, descripcion, duracion, precio } = req.body;

  if (
    nombre === undefined ||
    descripcion === undefined ||
    duracion === undefined ||
    precio === undefined
  ) {
    return res.status(400).json({
      error:
        "Todos los campos (nombre, descripcion, duracion, precio) son obligatorios",
    });
  }
  next();
};
