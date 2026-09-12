import { Router } from "express";
import {
    aplicarDescuento,
    obtenerTotal
} from "../controllers/productos.controller.js";
import { validarDescuento } from "../middlewares/validaciones.middleware.js"

const router = Router();

router.get("/total", obtenerTotal);
router.post("/aplicar-descuento", validarDescuento, aplicarDescuento);

export default router;