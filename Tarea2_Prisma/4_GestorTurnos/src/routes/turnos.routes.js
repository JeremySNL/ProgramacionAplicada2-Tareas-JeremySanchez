import { Router } from "express";
import {
    crearTurno,
    finalizarTurno,
    llamarSiguiente,
    obtenerCantidadEsperando,
    obtenerSiguienteTurno,
    obtenerTurnos
} from "../controllers/turnos.controller.js";
import { 
    validarCliente,
    validarServicio
} from "../middlewares/validaciones.middleware.js"

const router = Router();

router.post("/", validarCliente, validarServicio, crearTurno);
router.get("/", obtenerTurnos);
router.get("/siguiente", obtenerSiguienteTurno);
router.put("/llamar", llamarSiguiente);
router.put("/:id/finalizar", finalizarTurno);
router.get("/espera", obtenerCantidadEsperando);

export default router;
