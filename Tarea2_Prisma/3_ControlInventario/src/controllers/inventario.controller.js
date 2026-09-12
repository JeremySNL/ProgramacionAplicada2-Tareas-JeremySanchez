import prisma from "../db.js";

// Listar inventario
export const obtenerInventario = async (req, res) => {
  const inventario = await prisma.inventario.findMany();
  res.json(inventario);
};

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { producto, stock, stockMinimo = 5 } = req.body;
    const nuevoProducto = await prisma.inventario.create({
      data: {
        producto,
        stock,
        stockMinimo,
      },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.log("Error creando el producto: " + error);
    res.status(500).json({
      error: "Error interno del servidor al crear el producto",
    });
  }
};

// Entrada de inventario
export const registrarEntrada = async (req, res) => {
  const producto = await prisma.inventario.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }
  const { cantidad } = req.body;

  const productoActualizado = await prisma.inventario.update({
    where: {
      id: producto.id,
    },
    data: {
      stock: { increment: cantidad },
    },
  });
  res.json(productoActualizado);
};

// Salida de inventario
export const registrarSalida = async (req, res) => {
   const producto = await prisma.inventario.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  const { cantidad } = req.body;

  if (cantidad > producto.stock) {
    return res.status(400).json({
      error: "No hay suficiente stock disponible",
    });
  }

  const productoActualizado = await prisma.inventario.update({
    where: {
      id: producto.id,
    },
    data: {
      stock: { decrement: cantidad },
    },
  });
  res.json(productoActualizado);
};

// Productos bajo stock mínimo
export const obtenerProductosEnAlerta = async (req, res) => {
  const inventario = await prisma.inventario.findMany();
    const alertas = inventario
    .filter((p) => p.stock < p.stockMinimo)
    .map((p) => ({
      id: p.id,
      producto: p.producto,
      stock: p.stock,
      stockMinimo: p.stockMinimo,
      falta: p.stockMinimo - p.stock,
    }));
  res.json(alertas);
};
