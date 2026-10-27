import { Router } from "express";
import { login, registrar } from "./../controllers/auth.controller.js";
import {
    validarEmail,
    validarNombre,
    validarRol,
    validarPassword
} from "./../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", validarEmail, validarPassword, login);
router.post("/registro", validarNombre, validarEmail, validarPassword, validarRol, registrar);

export default router;
