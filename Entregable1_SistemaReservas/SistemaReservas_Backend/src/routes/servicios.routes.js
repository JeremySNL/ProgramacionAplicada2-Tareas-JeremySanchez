import { Router } from "express";
import { soloAdmin } from "../middlewares/auth.middleware.js";
import {
  crearServicio,
  editarServicio,
  eliminarServicio,
  obtenerServicios,
} from "./../controllers/servicios.controller.js";
import {
  requerirCamposServicio,
  validarDescripcion,
  validarDuracion,
  validarNombre,
  validarPrecio,
} from "../middlewares/validaciones.servicios.middleware.js";
import { validarId } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerServicios);
router.post(
  "/",
  soloAdmin,
  requerirCamposServicio,
  validarDescripcion,
  validarDuracion,
  validarNombre,
  validarPrecio,
  crearServicio,
);
router.put(
  "/:id",
  soloAdmin,
  validarDescripcion,
  validarDuracion,
  validarNombre,
  validarPrecio,
  validarId,
  editarServicio,
);
router.delete("/:id", soloAdmin, validarId, eliminarServicio);

export default router;
