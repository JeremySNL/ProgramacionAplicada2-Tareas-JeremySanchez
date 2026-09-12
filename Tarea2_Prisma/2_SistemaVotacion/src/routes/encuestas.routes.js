import { Router } from "express";
import {
    crearEncuesta,
    listarEncuestas,
    eliminarEncuesta,
    obtenerResultados,
    registrarVoto,
} from "../controllers/encuestas.controller.js"
const router = Router();

router.get("/", listarEncuestas);
router.get("/:id/resultados", obtenerResultados);
router.post("/", crearEncuesta);
router.post("/:id/votar", registrarVoto);
router.delete("/:id", eliminarEncuesta);

export default router;