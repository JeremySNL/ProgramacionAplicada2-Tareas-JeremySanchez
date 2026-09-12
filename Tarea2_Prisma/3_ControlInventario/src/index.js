import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware.js"
import inventarioRoutes from "./routes/inventarios.routes.js"

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/inventario", inventarioRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
