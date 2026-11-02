import prisma from "../db.js";

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
