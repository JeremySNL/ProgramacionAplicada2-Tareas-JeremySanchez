export const validarNombre = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es requerido",
    });
  }

  next();
};

export const validarMeta = (req, res, next) => {
  const { meta } = req.body;

  if (!meta) {
    return res.status(400).json({
      error: "La meta es requerida",
    });
  }

  next();
};
