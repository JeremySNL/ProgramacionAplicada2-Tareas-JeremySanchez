export const validarPregunta = (req, res, next) => {
  const { pregunta } = req.body;
  if (!pregunta) {
    return res.status(400).json({
      error: "La pregunta es requerida",
    });
  }
  next();
};

export const validarOpciones = (req, res, next) => {
  const { opciones } = req.body;
  if (!Array.isArray(opciones) || opciones.length < 2) {
    return res.status(400).json({
      error: "La encuesta debe tener mínimo 2 opciones",
    });
  }
  next();
};

export const validarOpcion = (req, res, next) => {
  const { opcion } = req.body;
  if (!opcion) {
    return res.status(400).json({
      error: "La opción es requerida",
    });
  }
  next();
};
