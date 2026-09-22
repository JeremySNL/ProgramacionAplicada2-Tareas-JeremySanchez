import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/db.js";

describe("POST /auth/login", () => {

    beforeAll(async () => {
        await request(app)
            .post("/auth/registro")
            .send({
                nombre: "Login Test",
                email: "login@test.com",
                password: "Castilla02",
                rol: "usuario",
            });
    });

    afterAll(async () => {
        await prisma.usuario.deleteMany({
            where: {
                email: "login@test.com"
            }
        });
    });

    test("deberia iniciar sesion exitosamente", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "login@test.com",
                password: "Castilla02",
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    test("deberia rechazar una password incorrecta", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "login@test.com",
                password: "passwordIncorrecta",
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    test("deberia rechazar un email que no existe", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "noexiste@test.com",
                password: "Castilla02",
            });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
    });

    test("deberia rechazar un login sin credenciales", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

});