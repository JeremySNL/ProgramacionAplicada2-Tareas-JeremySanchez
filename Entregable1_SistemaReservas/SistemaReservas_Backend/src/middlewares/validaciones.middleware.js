export const validarId = (req, res, next) => {
  const numId = Number(req.params.id);

  if (!Number.isInteger(numId) || numId < 1) {
    return res.status(400).json({
      error: "El ID debe ser un número entero positivo",
    });
  }
  next();
};
