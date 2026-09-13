import prisma from "../db.js";

// POST: Crear hábito
export const crearHabito = async (req, res) => {
  try {
    const { nombre, meta } = req.body;
    const nuevoHabito = await prisma.habito.create({
      data: {
        nombre,
        meta,
      },
    });
    res.status(201).json(nuevoHabito);
  } catch (error) {
    console.error("Error al crear el habito:", error);
    res.status(500).json({
      error: "Error interno del servidor al crear el habito",
    });
  }
};

// GET: Obtener hábitos
export const obtenerHabitos = async (req, res) => {
  try {
    const habitos = await prisma.habito.findMany({
      include: {
        registros: true,
      },
    });
    res.json(habitos);
  } catch (error) {
    console.error("Error al obtener los habitos:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener los habitos",
    });
  }
};

// POST: Registrar hábito del día
export const registrarHabito = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const habito = await prisma.habito.findUnique({
      where: {
        id,
      },
    });

    if (!habito) {
      return res.status(404).json({
        error: "Hábito no encontrado",
      });
    }

    const fecha = normalizarFecha(new Date());

    const inicioDiaSiguiente = new Date(fecha);
    inicioDiaSiguiente.setDate(inicioDiaSiguiente.getDate() + 1);

    const registroExistente = await prisma.registro.findFirst({
      where: {
        idHabito: habito.id,
        fecha: {
          gte: fecha,
          lt: inicioDiaSiguiente,
        },
      },
    });

    if (registroExistente) {
      return res.status(400).json({
        error: "El hábito ya fue registrado hoy",
      });
    }

    const registro = await prisma.registro.create({
      data: {
        idHabito: habito.id,
        fecha,
        completado: true,
      },
    });

    return res.status(201).json({
      ...habito,
      registro,
    });
  } catch (error) {
    console.error("Error al registrar el habito:", error);
    res.status(500).json({
      error: "Error interno del servidor al registrar el habito",
    });
  }
};

// GET: Obtener estadísticas de un habito
export const obtenerEstadisticas = async (req, res) => {
  try {
    const habito = await prisma.habito.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        registros: true,
      },
    });

    if (!habito) {
      return res.status(404).json({
        error: "Hábito no encontrado",
      });
    }

    const fechas = habito.registros
      .filter((registro) => registro.completado)
      .map((registro) => normalizarFecha(registro.fecha))
      .sort((a, b) => a - b);

    if (fechas.length === 0) {
      return res.json({
        rachaActual: 0,
        mejorRacha: 0,
        porcentajeCumplimiento: 0,
      });
    }

    const hoy = normalizarFecha(new Date());

    let rachaActual = 0;

    const ultimaFecha = fechas[fechas.length - 1];

    const diasDesdeUltimoRegistro = diferenciaDias(hoy, ultimaFecha);

    if (diasDesdeUltimoRegistro <= 1) {
      rachaActual = 1;

      for (let i = fechas.length - 1; i > 0; i--) {
        const diferencia = diferenciaDias(fechas[i], fechas[i - 1]);

        if (diferencia === 1) {
          rachaActual++;
        } else {
          break;
        }
      }
    }

    let mejorRacha = 1;
    let racha = 1;

    for (let i = 1; i < fechas.length; i++) {
      const diferencia = diferenciaDias(fechas[i], fechas[i - 1]);

      if (diferencia === 1) {
        racha++;
      } else {
        racha = 1;
      }

      mejorRacha = Math.max(mejorRacha, racha);
    }

    const primerDia = fechas[0];

    const diasTranscurridos = diferenciaDias(hoy, primerDia) + 1;

    const porcentajeCumplimiento = Math.min(
      (fechas.length / diasTranscurridos) * 100,
      100,
    );

    return res.json({
      rachaActual,
      mejorRacha,
      porcentajeCumplimiento: Math.round(porcentajeCumplimiento * 100) / 100,
    });
  } catch (error) {
    console.error("Error al obtener las estadisticas:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener las estadisticas",
    });
  }
};

// DELETE: Eliminar un hábito
export const eliminarHabito = async (req, res) => {
  try {
    const habito = await prisma.habito.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!habito) {
      return res.status(404).json({
        error: "Hábito no encontrado",
      });
    }

    const habitoEliminado = await prisma.habito.delete({
      where: {
        id: habito.id,
      },
    });
    res.json({
      mensaje: "Hábito eliminado correctamente.",
      habitoEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar el habito:", error);
    res.status(500).json({
      error: "Error interno del servidor al eliminar el habito",
    });
  }
};

// Funciones auxiliares
const normalizarFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setHours(0, 0, 0, 0);
  return nuevaFecha;
};

const diferenciaDias = (fecha1, fecha2) => {
  return Math.round((fecha1 - fecha2) / (1000 * 60 * 60 * 24));
};
