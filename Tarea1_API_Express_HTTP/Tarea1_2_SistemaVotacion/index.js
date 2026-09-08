const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarPregunta = (req, res, next) => {
  const { pregunta } = req.body;
  if (!pregunta) {
    return res.status(400).json({
      error: "La pregunta es requerida",
    });
  }
  next();
};

const validarOpciones = (req, res, next) => {
  const { opciones } = req.body;
  if (!Array.isArray(opciones) || opciones.length < 2) {
    return res.status(400).json({
      error: "La encuesta debe tener mínimo 2 opciones",
    });
  }
  next();
};

const validarOpcion = (req, res, next) => {
  const { opcion } = req.body;
  if (!opcion) {
    return res.status(400).json({
      error: "La opción es requerida",
    });
  }
  next();
};

let nextId = 2;

let encuestas = [
  {
    id: 1,
    pregunta: "¿Cuál lenguaje prefieres?",
    opciones: [
      {
        nombre: "JavaScript",
        votos: 0,
      },
      {
        nombre: "Python",
        votos: 0,
      },
    ],
  },
];

// Crear encuesta
app.post("/encuestas", validarPregunta, validarOpciones, (req, res) => {
  const { pregunta, opciones } = req.body;

  const nuevaEncuesta = {
    id: nextId++,
    pregunta,
    opciones: opciones.map((opcion) => ({
      nombre: opcion,
      votos: 0,
    })),
  };

  encuestas.push(nuevaEncuesta);

  res.status(201).json(nuevaEncuesta);
});

// Listar encuestas
app.get("/encuestas", (req, res) => {
  res.json(encuestas);
});

// Registrar voto
app.post("/encuestas/:id/votar", validarOpcion, (req, res) => {
  const encuesta = encuestas.find((e) => e.id === parseInt(req.params.id));

  if (!encuesta) {
    return res.status(404).json({
      error: "Encuesta no encontrada",
    });
  }
  const { opcion } = req.body;
  const opcionEncontrada = encuesta.opciones.find(
    (o) => o.nombre.toLowerCase() === opcion.toLowerCase(),
  );

  if (!opcionEncontrada) {
    return res.status(400).json({
      error: "La opción no existe en esta encuesta",
    });
  }
  opcionEncontrada.votos++;
  res.json({
    mensaje: "Voto registrado correctamente",
    opcion: opcionEncontrada.nombre,
  });
});

// Ver resultados
app.get("/encuestas/:id/resultados", (req, res) => {
  const encuesta = encuestas.find((e) => e.id === parseInt(req.params.id));
  if (!encuesta) {
    return res.status(404).json({
      error: "Encuesta no encontrada",
    });
  }
  let totalVotos = 0;
  encuesta.opciones.forEach((opcion) => {
    totalVotos += opcion.votos;
  });
  const resultados = encuesta.opciones.map((opcion) => ({
    opcion: opcion.nombre,
    votos: opcion.votos,
    porcentaje: totalVotos === 0 ? 0 : (opcion.votos / totalVotos) * 100,
  }));

  const ganador = encuesta.opciones.reduce((mayor, opcion) =>
    opcion.votos > mayor.votos ? opcion : mayor,
  );

  res.json({
    pregunta: encuesta.pregunta,
    totalVotos,
    resultados,
    ganador: ganador.nombre,
  });
});

// Eliminar encuesta
app.delete("/encuestas/:id", (req, res) => {
  const index = encuestas.findIndex((e) => e.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      error: "Encuesta no encontrada",
    });
  }

  encuestas.splice(index, 1);

  res.json({
    mensaje: "Encuesta eliminada correctamente.",
  });
});
