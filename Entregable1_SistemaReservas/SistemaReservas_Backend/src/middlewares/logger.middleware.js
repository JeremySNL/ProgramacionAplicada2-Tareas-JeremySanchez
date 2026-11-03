import { formatearFechaAtlantico } from "../utils/fecha.js";

const loggerMiddleware = (req, res, next) => {
    console.log(`[${formatearFechaAtlantico()}] ${req.method} ${req.url}`);
    next();
}

export default loggerMiddleware;
