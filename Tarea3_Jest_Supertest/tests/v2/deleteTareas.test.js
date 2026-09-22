import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/db.js";

describe("DELETE /v2/tareas/:id", () => {
  let usuario;
  let admin;
  let tokenUsuario;
  let tokenAdmin;

  beforeAll(async () => {
    await request(app).post("/auth/registro").send({
      nombre: "Usuario Delete Test",
      email: "deleteusuario@test.com",
      password: "123456",
      rol: "usuario",
    });

    await request(app).post("/auth/registro").send({
      nombre: "Admin Delete Test",
      email: "deleteadmin@test.com",
      password: "123456",
      rol: "admin",
    });

    usuario = await prisma.usuario.findUnique({
      where: {
        email: "deleteusuario@test.com",
      },
    });

    admin = await prisma.usuario.findUnique({
      where: {
        email: "deleteadmin@test.com",
      },
    });

    const loginUsuario = await request(app).post("/auth/login").send({
      email: "deleteusuario@test.com",
      password: "123456",
    });

    tokenUsuario = loginUsuario.body.token;

    const loginAdmin = await request(app).post("/auth/login").send({
      email: "deleteadmin@test.com",
      password: "123456",
    });

    tokenAdmin = loginAdmin.body.token;
  });

  afterEach(async () => {
    await prisma.tarea.deleteMany({
      where: {
        usuarioId: {
          in: [usuario.id, admin.id],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: {
        id: {
          in: [usuario.id, admin.id],
        },
      },
    });
  });

  test("un admin deberia poder eliminar cualquier tarea", async () => {
    const tarea = await prisma.tarea.create({
      data: {
        titulo: "Tarea de cualquier usuario",
        usuarioId: usuario.id,
      },
    });

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.id}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensaje", "Eliminada");
  });

  test("un usuario deberia poder eliminar su propia tarea", async () => {
    const tarea = await prisma.tarea.create({
      data: {
        titulo: "Tarea propia",
        usuarioId: usuario.id,
      },
    });

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.id}`)
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensaje", "Eliminada");
  });

  test("un usuario no deberia poder eliminar la tarea de otro usuario", async () => {
    const tarea = await prisma.tarea.create({
      data: {
        titulo: "Tarea del admin",
        usuarioId: admin.id,
      },
    });

    const res = await request(app)
      .delete(`/v2/tareas/${tarea.id}`)
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
  });

  test("deberia rechazar una peticion sin token", async () => {
    const tarea = await prisma.tarea.create({
      data: {
        titulo: "Tarea de prueba",
        usuarioId: usuario.id,
      },
    });

    const res = await request(app).delete(`/v2/tareas/${tarea.id}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
