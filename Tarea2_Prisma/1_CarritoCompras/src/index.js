import "dotenv/config"
import productosRoutes from "./routes/productos.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware.js";

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});