import { Router } from "express";
import { soloAdmin, soloCliente } from "../middlewares/auth.middleware.js";
import {
  cancelarReserva,
  cambiarEstadoReserva,
  crearReserva,
  obtenerMisReservas,
  obtenerReservas,
} from "../controllers/reservas.controller.js";
import { validarId } from "../middlewares/validaciones.middleware.js";
import {
  requerirCamposReserva,
  validarEstadoReserva,
  validarFechaReserva,
  validarHoraReserva,
  validarServicioId,
} from "../middlewares/validaciones.reservas.middleware.js";

const router = Router();

router.post(
  "/",
  soloCliente,
  requerirCamposReserva,
  validarServicioId,
  validarFechaReserva,
  validarHoraReserva,
  crearReserva,
);
router.get("/mis-reservas", soloCliente, obtenerMisReservas);
router.get("/", soloAdmin, obtenerReservas);
router.put(
  "/:id/estado",
  soloAdmin,
  validarId,
  validarEstadoReserva,
  cambiarEstadoReserva,
);
router.delete("/:id", soloCliente, validarId, cancelarReserva);

export default router;
