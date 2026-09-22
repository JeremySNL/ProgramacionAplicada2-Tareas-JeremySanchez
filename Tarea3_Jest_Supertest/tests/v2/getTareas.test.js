import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/db.js";

describe("GET /v2/tareas", () => {
  let usuario;
  let admin;
  let tokenUsuario;
  let tokenAdmin;

  beforeAll(async () => {
    await request(app).post("/auth/registro").send({
      nombre: "Usuario V2 Test",
      email: "v2usuario@test.com",
      password: "123456",
      rol: "usuario",
    });

    await request(app).post("/auth/registro").send({
      nombre: "Admin V2 Test",
      email: "v2admin@test.com",
      password: "123456",
      rol: "admin",
    });

    usuario = await prisma.usuario.findUnique({
      where: {
        email: "v2usuario@test.com",
      },
    });

    admin = await prisma.usuario.findUnique({
      where: {
        email: "v2admin@test.com",
      },
    });

    await prisma.tarea.create({
      data: {
        titulo: "Tarea del usuario",
        usuarioId: usuario.id,
      },
    });

    await prisma.tarea.create({
      data: {
        titulo: "Tarea del admin",
        usuarioId: admin.id,
      },
    });

    const loginUsuario = await request(app).post("/auth/login").send({
      email: "v2usuario@test.com",
      password: "123456",
    });

    tokenUsuario = loginUsuario.body.token;

    const loginAdmin = await request(app).post("/auth/login").send({
      email: "v2admin@test.com",
      password: "123456",
    });

    tokenAdmin = loginAdmin.body.token;
  });

  afterAll(async () => {
    await prisma.tarea.deleteMany({
      where: {
        usuarioId: {
          in: [usuario.id, admin.id],
        },
      },
    });

    await prisma.usuario.deleteMany({
      where: {
        id: {
          in: [usuario.id, admin.id],
        },
      },
    });
  });

  test("deberia rechazar una peticion sin token", async () => {
    const res = await request(app).get("/v2/tareas");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("deberia rechazar un token invalido", async () => {
    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", "Bearer token-invalido");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("un usuario normal deberia obtener solamente sus tareas", async () => {
    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe("Tarea del usuario");
    expect(res.body[0].usuarioId).toBe(usuario.id);
  });

  test("un admin deberia obtener todas las tareas", async () => {
    const res = await request(app)
      .get("/v2/tareas")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body).toHaveLength(2);
  });
});
