import prisma from "../db.js";
import ESTADOS from "../constants.js";

// POST: Crear turno
export const crearTurno = async (req, res) => {
  try {
    const { cliente, servicio } = req.body;
    const nuevoTurno = await prisma.turno.create({
      data: {
        cliente,
        servicio,
        estado: ESTADOS.Esperando,
      },
    });
    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.log("Error creando el turno: " + error);
    res.status(500).json({
      error: "Error interno del servidor al crear el turno",
    });
  }
};

// GET: Ver todos los turnos
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany();
    res.json(turnos);
  } catch (error) {
    console.log("Error obteniendo los turnos: " + error);
    res.status(500).json({
      error: "Error interno del servidor al obtener los turnos",
    });
  }
};

// GET: Ver quién es el próximo
export const obtenerSiguienteTurno = async (req, res) => {
  try {
    const siguiente = await prisma.turno.findFirst({
      where: {
        estado: ESTADOS.Esperando,
      },
    });
    if (!siguiente) {
      return res.status(404).json({
        error: "No hay turnos esperando",
      });
    }
    res.json(siguiente);
  } catch (error) {
    console.log("Error obteniendo el siguiente turno: " + error);
    res.status(500).json({
      error: "Error interno del servidor al obtener el siguiente turno",
    });
  }
};

// PUT: Llamar al siguiente
export const llamarSiguiente = async (req, res) => {
  try {
    const atendiendo = await prisma.turno.findFirst({
      where: {
        estado: ESTADOS.Atendiendo,
      },
    });
    if (atendiendo) {
      return res.status(400).json({
        error: "Ya hay un turno siendo atendido",
      });
    }

    const siguiente = await prisma.turno.findFirst({
      where: {
        estado: ESTADOS.Esperando,
      },
    });
    if (!siguiente) {
      return res.status(404).json({
        error: "No hay turnos esperando",
      });
    }

    const atendiendoActual = await prisma.turno.update({
      where: {
        id: siguiente.id,
      },
      data: {
        estado: ESTADOS.Atendiendo,
      },
    });
    res.json(atendiendoActual);
  } catch (error) {
    console.log("Error obteniendo el siguiente turno: " + error);
    res.status(500).json({
      error: "Error interno del servidor al obtener el siguiente turno",
    });
  }
};

// PUT: Finalizar turno
export const finalizarTurno = async (req, res) => {
  try {
    const turno = await prisma.turno.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!turno) {
      return res.status(404).json({
        error: "Turno no encontrado",
      });
    }

    if (turno.estado === ESTADOS.Esperando) {
      return res.status(400).json({
        error: "El turno no está siendo atendido",
      });
    }

    if (turno.estado === ESTADOS.Finalizado) {
      return res.status(400).json({
        error: "El turno ya ha finalizado",
      });
    }

    const turnoFinalizado = await prisma.turno.update({
      where: {
        id: turno.id,
      },
      data: {
        estado: ESTADOS.Finalizado,
      },
    });
    res.json(turnoFinalizado);
  } catch (error) {
    console.log("Error finalizando el turno: " + error);
    res.status(500).json({
      error: "Error interno del servidor finaliza el turno",
    });
  }
};

// GET: Cantidad de turnos esperando
export const obtenerCantidadEsperando = async (req, res) => {
  try {
    const turnosEspera = await prisma.turno.findMany({
      where: {
        estado: ESTADOS.Esperando,
      },
    });
    res.json({
      esperando: turnosEspera.length,
    });
  } catch (error) {
    console.log("Error obteniendo el siguiente turno: " + error);
    res.status(500).json({
      error: "Error interno del servidor al obtener el siguiente turno",
    });
  }
};
