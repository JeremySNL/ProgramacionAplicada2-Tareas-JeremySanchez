import prisma from "./../db.js";

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.json(servicios);
  } catch (error) {
    console.error("Error obteniendo los servicios: ", error);
    res.status(500).json({ error: "Error obteniendo los servicios" });
  }
};

export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, duracion, precio } = req.body;
    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion,
        precio,
      },
    });
    res.status(201).json(servicio);
  } catch (error) {
    console.error("Error creando servicio: ", error);
    res.status(500).json({ error: "Error creando servicio" });
  }
};

export const editarServicio = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, duracion, precio } = req.body;

    const servicioActualizado = await prisma.servicio.update({
      where: { id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(duracion !== undefined && { duracion: Number(duracion) }),
        ...(precio !== undefined && { precio: Number(precio) }),
      },
    });

    res.json(servicioActualizado);
  } catch (error) {
    // P2025 Codigo de error de Prisma cuando el registro no existe
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: `No existe un servicio con id: ${id}` });
    }
    console.error("Error actualizando servicio: ", error);
    res.status(500).json({ error: "Error actualizando servicio" });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const servicioEliminado = await prisma.servicio.delete({
      where: { id },
    });

    res.json(servicioEliminado);
  } catch (error) {
    // P2025 Codigo de error de Prisma cuando el registro no existe
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: `No existe un servicio con id: ${id}` });
    }
    console.error("Error eliminando servicio: ", error);
    res.status(500).json({ error: "Error interno al eliminar el servicio" });
  }
};
