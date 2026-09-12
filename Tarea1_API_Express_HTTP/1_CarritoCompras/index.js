const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarNombre = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es requerido",
    });
  }
  next();
};

const validarPrecio = (req, res, next) => {
  const { precio } = req.body;
  if (typeof precio !== "number" || precio <= 0) {
    return res.status(400).json({
      error: "El precio debe ser un número positivo",
    });
  }
  next();
};

const validarCantidad = (req, res, next) => {
  const { cantidad } = req.body;

  if (typeof cantidad !== "number" || cantidad <= 0) {
    return res.status(400).json({
      error: "La cantidad debe ser un número positivo",
    });
  }

  next();
};

const validarDescuento = (req, res, next) => {
  const { porcentaje } = req.body;
  if (typeof porcentaje !== "number" || porcentaje < 0 || porcentaje > 0.5) {
    return res.status(400).json({
      error: "El descuento debe estar entre 0% y 50%",
    });
  }
  next();
};

let nextId = 2;
let productos = [
  {
    id: 1,
    nombre: "Botella de agua",
    precio: 100,
    cantidad: 3,
  },
];

// Teniendo en cuenta que descuento es decimal, 20% = 0.20
const calcularTotal = (porcentaje = 0) => {
  let total = 0;
  productos.forEach((producto) => {
    total += producto.precio * producto.cantidad * (1 - porcentaje);
  });
  return total;
};

// Obtener todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Agregar producto
app.post(
  "/productos",
  validarNombre,
  validarPrecio,
  validarCantidad,
  (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const productoExistente = productos.find(
      (p) => p.nombre.toLowerCase() === nombre.toLowerCase(),
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;

      return res.json(productoExistente);
    }

    const nuevoProducto = {
      id: nextId++,
      nombre,
      precio,
      cantidad,
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
  },
);

// Actualizar cantidad
app.put("/productos/:id", validarCantidad, (req, res) => {
  const producto = productos.find((p) => p.id === parseInt(req.params.id));
  if (!producto)
    return res.status(404).json({ error: "Producto no encontrado" });
  const { cantidad } = req.body;
  producto.cantidad = cantidad;
  res.json(producto);
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const index = productos.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ error: "Producto no encontrado" });
  productos.splice(index, 1);
  res.json({ mensaje: "Producto eliminado correctamente." });
});

// Calcular total (precio × cantidad)
app.get("/carrito/total", (req, res) => {
  const total = calcularTotal();
  res.json({ total });
});

// Recibe { porcentaje } y devuelve el total con descuento
app.post("/carrito/aplicar-descuento", validarDescuento, (req, res) => {
  const { porcentaje } = req.body; // Teniendo en cuenta que descuento es decimal, 20% = 0.20
  const total = calcularTotal(porcentaje);
  res.json({ total });
});
