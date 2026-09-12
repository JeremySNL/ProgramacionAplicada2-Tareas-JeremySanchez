export const validarNombre = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es requerido",
    });
  }
  next();
};

export const validarPrecio = (req, res, next) => {
  const { precio } = req.body;
  if (typeof precio !== "number" || precio <= 0) {
    return res.status(400).json({
      error: "El precio debe ser un número positivo",
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

export const validarDescuento = (req, res, next) => {
  const { porcentaje } = req.body;
  if (typeof porcentaje !== "number" || porcentaje < 0 || porcentaje > 0.5) {
    return res.status(400).json({
      error: "El descuento debe estar entre 0% y 50%",
    });
  }
  next();
};