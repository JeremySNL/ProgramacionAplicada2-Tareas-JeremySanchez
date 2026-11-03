import { Router } from "express";
import { validarNombre } from "../middlewares/auth.middleware.js"
import { cambiarNombre, obtenerPerfil } from "../controllers/usuarios.controller.js"

const router = Router();

router.get("/perfil", obtenerPerfil);
router.put("/perfil", validarNombre, cambiarNombre);

export default router;
