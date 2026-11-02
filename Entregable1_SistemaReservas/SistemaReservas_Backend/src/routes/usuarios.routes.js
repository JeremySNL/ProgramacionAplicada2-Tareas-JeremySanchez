import { Router } from "express";
import { validarNombre } from "../middlewares/auth.middleware.js"
import { cambiarNombre } from "../controllers/usuarios.controller.js"

const router = Router();

router.put("/perfil", validarNombre, cambiarNombre);

export default router;
