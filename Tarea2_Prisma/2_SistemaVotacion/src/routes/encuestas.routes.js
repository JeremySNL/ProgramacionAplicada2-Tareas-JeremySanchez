import { Router } from "express";
import {
    crearEncuesta,
    listarEncuestas,
    eliminarEncuesta,
    obtenerResultados,
    registrarVoto,
} from "../controllers/encuestas.controller.js"
import {
    validarOpcion,
    validarPregunta,
    validarOpciones
} from "../middlewares/validaciones.middleware.js";
const router = Router();

router.get("/", listarEncuestas);
router.get("/:id/resultados", obtenerResultados);
router.post("/", validarPregunta, validarOpciones, crearEncuesta);
router.post("/:id/votar", validarOpcion, registrarVoto);
router.delete("/:id", eliminarEncuesta);

export default router;