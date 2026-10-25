import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";
import { verificarToken } from "./middlewares/auth.middleware.js";
import CORS from "cors";

const app = express();

app.use(express.json());
app.use(CORS());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/auth", authRoutes);
app.use("/servicios", verificarToken, serviciosRoutes);

export default app;
