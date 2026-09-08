const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarNombre = (req, res, next) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es requerido",
    });
  }

  next();
};

const validarMeta = (req, res, next) => {
  const { meta } = req.body;

  if (!meta) {
    return res.status(400).json({
      error: "La meta es requerida",
    });
  }

  next();
};

let nextId = 2;

let habitos = [
  {
    id: 1,
    nombre: "Hacer ejercicio",
    meta: "30 minutos diarios",
    registros: [],
  },
];

// Crear hábito
app.post(
  "/habitos",
  validarNombre,
  validarMeta,
  (req, res) => {
    const { nombre, meta } = req.body;

    const nuevoHabito = {
      id: nextId++,
      nombre,
      meta,
      registros: [],
    };

    habitos.push(nuevoHabito);

    res.status(201).json(nuevoHabito);
  },
);

// Listar hábitos
app.get("/habitos", (req, res) => {
  res.json(habitos);
});

// Registrar hábito del día
app.post("/habitos/:id/registrar", (req, res) => {
  const habito = habitos.find(
    (h) => h.id === parseInt(req.params.id),
  );

  if (!habito) {
    return res.status(404).json({
      error: "Hábito no encontrado",
    });
  }

  const fecha = new Date().toISOString().split("T")[0];

  const registroExistente = habito.registros.find(
    (registro) => registro.fecha === fecha,
  );

  if (registroExistente) {
    return res.status(400).json({
      error: "El hábito ya fue registrado hoy",
    });
  }

  habito.registros.push({
    fecha,
    completado: true,
  });

  res.json(habito);
});

// Estadísticas
app.get("/habitos/:id/estadisticas", (req, res) => {
  const habito = habitos.find(
    (h) => h.id === parseInt(req.params.id),
  );

  if (!habito) {
    return res.status(404).json({
      error: "Hábito no encontrado",
    });
  }

  const registros = habito.registros;

  if (registros.length === 0) {
    return res.json({
      rachaActual: 0,
      mejorRacha: 0,
      porcentajeCumplimiento: 0,
    });
  }

  const fechas = registros
    .filter((registro) => registro.completado)
    .map((registro) => registro.fecha)
    .sort();

  // Racha actual
  let rachaActual = 0;

  for (let i = fechas.length - 1; i >= 0; i--) {
    const fecha = new Date(fechas[i] + "T00:00:00");

    if (i === fechas.length - 1) {
      rachaActual = 1;
      continue;
    }

    const fechaAnterior = new Date(
      fechas[i + 1] + "T00:00:00",
    );

    const diferencia =
      (fechaAnterior - fecha) / (1000 * 60 * 60 * 24);

    if (diferencia === 1) {
      rachaActual++;
    } else {
      break;
    }
  }

  // Mejor racha
  let mejorRacha = 1;
  let racha = 1;

  for (let i = 1; i < fechas.length; i++) {
    const fechaActual = new Date(fechas[i] + "T00:00:00");
    const fechaAnterior = new Date(
      fechas[i - 1] + "T00:00:00",
    );

    const diferencia =
      (fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24);

    if (diferencia === 1) {
      racha++;
    } else {
      racha = 1;
    }

    if (racha > mejorRacha) {
      mejorRacha = racha;
    }
  }

  // Porcentaje de cumplimiento
  const primerDia = new Date(fechas[0] + "T00:00:00");
  const hoy = new Date();

  primerDia.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const diasTranscurridos =
    Math.floor(
      (hoy - primerDia) / (1000 * 60 * 60 * 24),
    ) + 1;

  const porcentajeCumplimiento =
    (fechas.length / diasTranscurridos) * 100;

  res.json({
    rachaActual,
    mejorRacha,
    porcentajeCumplimiento:
      Math.round(porcentajeCumplimiento * 100) / 100,
  });
});

// Eliminar hábito
app.delete("/habitos/:id", (req, res) => {
  const index = habitos.findIndex(
    (h) => h.id === parseInt(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Hábito no encontrado",
    });
  }

  habitos.splice(index, 1);

  res.json({
    mensaje: "Hábito eliminado correctamente.",
  });
});