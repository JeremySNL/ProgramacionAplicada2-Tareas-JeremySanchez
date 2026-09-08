const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const validarProducto = (req, res, next) => {
  const { producto } = req.body;

  if (!producto) {
    return res.status(400).json({
      error: "El producto es requerido",
    });
  }

  next();
};

const validarStock = (req, res, next) => {
  const { stock } = req.body;

  if (typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      error: "El stock debe ser un número positivo",
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

let nextId = 2;

let inventario = [
  {
    id: 1,
    producto: "Mouse",
    stock: 10,
    stockMinimo: 5,
  },
];

// Listar inventario
app.get("/inventario", (req, res) => {
  res.json(inventario);
});

// Crear producto
app.post(
  "/inventario",
  validarProducto,
  validarStock,
  (req, res) => {
    const { producto, stock, stockMinimo = 5 } = req.body;

    const nuevoProducto = {
      id: nextId++,
      producto,
      stock,
      stockMinimo,
    };

    inventario.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
  },
);

// Entrada de inventario
app.post(
  "/inventario/:id/entrada",
  validarCantidad,
  (req, res) => {
    const producto = inventario.find(
      (p) => p.id === parseInt(req.params.id),
    );

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    const { cantidad } = req.body;

    producto.stock += cantidad;

    res.json(producto);
  },
);

// Salida de inventario
app.post(
  "/inventario/:id/salida",
  validarCantidad,
  (req, res) => {
    const producto = inventario.find(
      (p) => p.id === parseInt(req.params.id),
    );

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

    producto.stock -= cantidad;

    res.json(producto);
  },
);

// Productos bajo stock mínimo
app.get("/inventario/alertas", (req, res) => {
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
});