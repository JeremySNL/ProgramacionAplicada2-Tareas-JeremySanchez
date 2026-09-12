import prisma from "../db.js";

// Crear encuesta
export const crearEncuesta = async (req, res) => {
  try {
    const { pregunta, opciones } = req.body;
    const nuevaEncuesta = await prisma.encuesta.create({
      data: {
        pregunta,
        opciones: {
          create: opciones.map((opcion) => ({
            descripcion: opcion.descripcion,
            votos: 0,
          })),
        },
      },
      include: {
        opciones: true
      }
    });
    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    console.log("Error creando la encuesta: " + error);
    res.status(500).json({
      error: "Error interno del servidor al crear la encuesta",
    });
  }
};

// Listar encuestas
export const listarEncuestas = async (req, res) => {
  try {
    const encuestas = await prisma.encuesta.findMany({
      include: {
        opciones: true,
      },
    });
    res.json(encuestas);
  } catch (error) {
    console.log("Error obteniendo las encuestas: " + error);
    res.status(500).json({
      error: "Error interno del servidor al consultar las encuestas",
    });
  }
};

// Registrar voto
export const registrarVoto = async (req, res) => {
  try {
    const encuesta = await prisma.encuesta.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!encuesta) {
      return res.status(404).json({
        error: "Encuesta no encontrada",
      });
    }
    const { descripcion } = req.body;
    const opcionEncontrada = await prisma.opcion.findFirst({
      where: {
        descripcion: {
          equals: descripcion,
          mode: "insensitive",
        },
      },
    });

    if (!opcionEncontrada) {
      return res.status(400).json({
        error: "La opción no existe en esta encuesta",
      });
    }
    const opcionActualizada = await prisma.opcion.update({
      where: {
        id: opcionEncontrada.id,
      },
      data: {
        votos: { increment: 1 },
      },
    });
    res.json({
      mensaje: "Voto registrado correctamente",
      encuesta: encuesta.pregunta,
      opcionVotada: opcionActualizada.descripcion,
    });
  } catch (error) {
    console.log("Error registrando el voto en la encuesta: " + error);
    res.status(500).json({
      error:
        "Error interno del servidor al registrar el voto en la encuesta",
    });
  }
};

// Ver resultados
export const obtenerResultados = async (req, res) => {
  try {
    const encuesta = await prisma.encuesta.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        opciones: true,
      },
    });
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
  } catch (error) {
    console.log("Error obteniendo los resultados de la encuesta: " + error);
    res.status(500).json({
      error:
        "Error interno del servidor al obtener los resultados de la encuesta",
    });
  }
};

// Eliminar encuesta
export const eliminarEncuesta = async (req, res) => {
  try {
    const encuestaEliminada = await prisma.encuesta.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!encuestaEliminada) {
      return res.status(404).json({
        error: "Encuesta no encontrada",
      });
    }
    res.json({
      mensaje: "Encuesta eliminada correctamente.",
    });
  } catch (error) {
    console.log("Error eliminando la encuesta: " + error);
    res.status(500).json({
      error: "Error interno del servidor al eliminar la encuesta",
    });
  }
};
