export const validarProducto = (req, res, next) => {
  const { producto } = req.body;

  if (!producto) {
    return res.status(400).json({
      error: "El producto es requerido",
    });
  }

  next();
};

export const validarStock = (req, res, next) => {
  const { stock } = req.body;

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      error: "El stock debe ser un número positivo",
    });
  }

  next();
};

export const validarCantidad = (req, res, next) => {
  const { cantidad } = req.body;

  if (typeof cantidad !== "number" || cantidad <= 0) {
    return res.status(400).json({
      error: "La cantidad debe ser un número positivo",
    });
  }

  next();
};