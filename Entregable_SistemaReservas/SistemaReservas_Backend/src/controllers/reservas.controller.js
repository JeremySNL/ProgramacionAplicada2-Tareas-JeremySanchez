import prisma from "./../db.js";
import { EstadoReserva } from "@prisma/client";

export const obtenerReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        servicio: true,
        usuario: {
          select: { id: true, nombre: true, email: true, rol: true },
        },
      },
    });
    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo las reservas: ", error);
    res.status(500).json({ error: "Error obteniendo las reservas" });
  }
};

export const obtenerMisReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: {
        usuarioId: parseInt(req.usuario.id),
      },
      include: { servicio: true },
    });
    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo las reservas: ", error);
    res.status(500).json({ error: "Error obteniendo las reservas" });
  }
};

export const crearReserva = async (req, res) => {
  try {
    const { servicioId, fecha, hora } = req.body;
    const idServicio = parseInt(servicioId);
    const fechaReserva = new Date(fecha);
    const horaReserva = new Date(`1970-01-01T${hora}:00.000Z`);

    const servicio = await prisma.servicio.findUnique({
      where: { id: idServicio },
    });

    if (!servicio) {
      return res.status(404).json({ error: "No existe el servicio indicado" });
    }

    const reserva = await prisma.reserva.create({
      data: {
        fecha: fechaReserva,
        hora: horaReserva,
        usuarioId: parseInt(req.usuario.id, 10),
        servicioId: idServicio,
      },
      include: { servicio: true },
    });
    res.status(201).json(reserva);
  } catch (error) {
    console.error("Error creando la reserva: ", error);
    res.status(500).json({ error: "Error creando la reserva" });
  }
};

export const cambiarEstadoReserva = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { estado } = req.body;

  try {
    const reservaActualizada = await prisma.reserva.update({
      where: { id },
      data: { estado },
    });
    res.json(reservaActualizada);
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: `No existe una reserva con id: ${id}` });
    }
    console.error("Error actualizando la reserva: ", error);
    res.status(500).json({ error: "Error actualizando la reserva" });
  }
};

export const cancelarReserva = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const resultado = await prisma.reserva.updateMany({
      where: {
        id,
        usuarioId: parseInt(req.usuario.id, 10),
        estado: EstadoReserva.PENDIENTE,
      },
      data: { estado: EstadoReserva.CANCELADA },
    });

    if (resultado.count === 0) {
      return res.status(404).json({
        error: "No existe una reserva pendiente con ese id para este usuario",
      });
    }

    const reservaCancelada = await prisma.reserva.findUnique({
      where: { id },
      include: { servicio: true },
    });
    res.json(reservaCancelada);
  } catch (error) {
    console.error("Error cancelando la reserva: ", error);
    res.status(500).json({ error: "Error cancelando la reserva" });
  }
};
