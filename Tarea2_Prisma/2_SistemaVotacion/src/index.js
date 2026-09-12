import express from "express";
import encuestasRoutes from "./routes/encuestas.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js"

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/encuestas", encuestasRoutes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
