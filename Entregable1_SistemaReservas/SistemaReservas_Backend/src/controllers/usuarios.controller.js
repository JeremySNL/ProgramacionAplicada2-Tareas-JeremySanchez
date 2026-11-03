import prisma from "../db.js";

export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.usuario.id,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "No existe el usuario" });
    }

    res.json({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
  } catch (error) {
    console.error("Error obteniendo el perfil: ", error);
    res.status(500).json({ error: "Error obteniendo el perfil" });
  }
};

export const cambiarNombre = async (req, res) => {
  try {
    const { nombre } = req.body;
    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: req.usuario.id,
      },
      data: {
        nombre,
      },
    });
    res.json({
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol,
    });
  } catch (error) {
    console.error("Error actualizando el perfil: ", error);
    res.status(500).json({ error: "Error actualizando el perfil" });
  }
};
