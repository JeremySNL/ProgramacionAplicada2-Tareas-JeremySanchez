import { Router } from "express";
import {
    crearProducto,
    obtenerInventario,
    obtenerProductosEnAlerta,
    registrarEntrada,
    registrarSalida
} from "../controllers/inventario.controller.js";
import {
    validarCantidad,
    validarProducto,
    validarStock
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerInventario);
router.post("/", validarProducto, validarStock, crearProducto);
router.post("/:id/entrada", validarCantidad, registrarEntrada);
router.post("/:id/salida", validarCantidad, registrarSalida);
router.get("/alertas", obtenerProductosEnAlerta);

export default router;