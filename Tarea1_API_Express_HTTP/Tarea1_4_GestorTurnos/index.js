const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarCliente = (req, res, next) => {
  const { cliente } = req.body;

  if (!cliente) {
    return res.status(400).json({
      error: "El cliente es requerido",
    });
  }

  next();
};

const validarServicio = (req, res, next) => {
  const { servicio } = req.body;

  if (!servicio) {
    return res.status(400).json({
      error: "El servicio es requerido",
    });
  }

  next();
};

let nextId = 2;

let turnos = [
  {
    id: 1,
    cliente: "Juan",
    servicio: "Consulta",
    estado: "esperando",
  },
];

// Crear turno
app.post(
  "/turnos",
  validarCliente,
  validarServicio,
  (req, res) => {
    const { cliente, servicio } = req.body;

    const nuevoTurno = {
      id: nextId++,
      cliente,
      servicio,
      estado: "esperando",
    };

    turnos.push(nuevoTurno);

    res.status(201).json(nuevoTurno);
  },
);

// Ver todos los turnos
app.get("/turnos", (req, res) => {
  res.json(turnos);
});

// Ver quién es el próximo
app.get("/turnos/siguiente", (req, res) => {
  const siguiente = turnos.find(
    (turno) => turno.estado === "esperando",
  );

  if (!siguiente) {
    return res.status(404).json({
      error: "No hay turnos esperando",
    });
  }

  res.json(siguiente);
});

// Llamar al siguiente
app.put("/turnos/llamar", (req, res) => {
  const atendiendo = turnos.find(
    (turno) => turno.estado === "atendiendo",
  );

  if (atendiendo) {
    return res.status(400).json({
      error: "Ya hay un turno siendo atendido",
    });
  }

  const siguiente = turnos.find(
    (turno) => turno.estado === "esperando",
  );

  if (!siguiente) {
    return res.status(404).json({
      error: "No hay turnos esperando",
    });
  }

  siguiente.estado = "atendiendo";

  res.json(siguiente);
});

// Finalizar turno
app.put("/turnos/:id/finalizar", (req, res) => {
  const turno = turnos.find(
    (t) => t.id === parseInt(req.params.id),
  );

  if (!turno) {
    return res.status(404).json({
      error: "Turno no encontrado",
    });
  }

  if (turno.estado !== "atendiendo") {
    return res.status(400).json({
      error: "El turno no está siendo atendido",
    });
  }

  turno.estado = "finalizado";

  res.json(turno);
});

// Cantidad de turnos esperando
app.get("/turnos/espera", (req, res) => {
  const cantidad = turnos.filter(
    (turno) => turno.estado === "esperando",
  ).length;

  res.json({
    esperando: cantidad,
  });
});