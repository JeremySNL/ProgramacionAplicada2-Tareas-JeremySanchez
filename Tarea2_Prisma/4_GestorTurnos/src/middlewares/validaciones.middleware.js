export const validarCliente = (req, res, next) => {
  const { cliente } = req.body;

  if (!cliente) {
    return res.status(400).json({
      error: "El cliente es requerido",
    });
  }

  next();
};

export const validarServicio = (req, res, next) => {
  const { servicio } = req.body;

  if (!servicio) {
    return res.status(400).json({
      error: "El servicio es requerido",
    });
  }

  next();
};