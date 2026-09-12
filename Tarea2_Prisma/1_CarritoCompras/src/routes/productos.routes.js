import { Router } from "express";
import {
    obtenerProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
} from "../controllers/productos.controller.js";
import {
    validarNombre,
    validarPrecio,
    validarCantidad,
} from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerProductos);
router.post("/", validarNombre, validarPrecio, validarCantidad, agregarProducto);
router.put("/:id", validarCantidad, actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;