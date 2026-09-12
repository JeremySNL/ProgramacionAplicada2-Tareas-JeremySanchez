import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/turnos", turnosRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
