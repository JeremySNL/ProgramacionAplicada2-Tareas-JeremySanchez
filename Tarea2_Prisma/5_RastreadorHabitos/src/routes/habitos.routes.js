import { Router } from "express";
import {
    crearHabito,
    eliminarHabito,
    obtenerEstadisticas,
    obtenerHabitos,
    registrarHabito
} from "../controllers/habitos.controller.js";
import {
    validarMeta,
    validarNombre
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarNombre, validarMeta, crearHabito);
router.get("/", obtenerHabitos);
router.post("/:id/registrar", registrarHabito);
router.get("/:id/estadisticas", obtenerEstadisticas);
router.delete("/:id", eliminarHabito);

export default router;
