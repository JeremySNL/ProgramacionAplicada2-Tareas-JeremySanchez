import prisma from "../db.js";

// Teniendo en cuenta que descuento es decimal, 20% = 0.20
const calcularTotal = async (porcentaje = 0) => {
  let productos = await prisma.producto.findMany();
  let total = 0;
  productos.forEach((producto) => {
    total += producto.precio * producto.cantidad * (1 - porcentaje);
  });
  return total;
};

// GET: Obtener todos los productos del carrito
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      error: "Error interno del servidor al consultar los productos",
    });
  }
};

// POST: Agregar un producto al carrito
export const agregarProducto = async (req, res) => {
  try {
    const { nombre, precio, cantidad } = req.body;
    const productoExistente = await prisma.producto.findFirst({
      where: {
        nombre: nombre.toLowerCase(),
      },
    });

    if (productoExistente) {
      const productoActualizado = await prisma.producto.update({
        where: {
          id: productoExistente.id,
        },
        data: {
          cantidad: {
            increment: cantidad,
          },
        },
      });
      return res.json(productoActualizado);
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: nombre.toLowerCase(),
        precio,
        cantidad,
      },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear un producto:", error);
    res.status(500).json({
      error: "Error interno del servidor al crear producto",
    });
  }
};

// PUT: Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await prisma.producto.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    const { cantidad } = req.body;
    const productoActualizado = await prisma.producto.update({
      where: {
        id: producto.id,
      },
      data: {
        cantidad,
      },
    });
    res.json(productoActualizado);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({
      error: "Error interno del servidor al consultar las tareas",
    });
  }
};

// DELETE: Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await prisma.producto.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!productoEliminado)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar un producto:", error);
    res.status(500).json({
      error: "Error interno del servidor al eliminar un producto",
    });
  }
};

// GET: Calcular total (precio × cantidad)
export const obtenerTotal = async (req, res) => {
  const total = await calcularTotal();
  res.json({ total });
};

// POST: Aplicar descuento al carrito
export const aplicarDescuento = async (req, res) => {
  const { porcentaje } = req.body; // Teniendo en cuenta que descuento es decimal, 20% = 0.20
  const total = await calcularTotal(porcentaje);
  res.json({ total });
};
