import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware.js"
import habitosRoutes from "./routes/habitos.routes.js"

const app = express();

app.use(express.json());
app.use(loggerMiddleware)

// Rutas modulares
app.use("/habitos", habitosRoutes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
