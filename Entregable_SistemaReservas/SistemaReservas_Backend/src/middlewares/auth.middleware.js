import jwt from "jsonwebtoken";
import { Rol } from "@prisma/client";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      error: "Token requerido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
};

export const soloAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  if (req.usuario.rol !== Rol.ADMIN) {
    return res.status(403).json({
      error: "Acceso denegado: requieres rol de administrador",
    });
  }
  next();
};

export const validarNombre = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res
      .status(400)
      .json({ error: "El nombre es obligatorio y no puede estar vacío." });
  }
  next();
};

export const validarEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "El email no es válido." });
  }
  next();
};

export const validarPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener al menos 6 caracteres." });
  }
  next();
};

export const validarRol = (req, res, next) => {
  const { rol } = req.body;
  if (rol && !Object.values(Rol).includes(rol)) {
    return res.status(400).json({
      error: `Rol inválido. Opciones válidas: ${Object.values(Rol).join(", ")}`,
    });
  }
  next();
};
