import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/db.js";

describe("POST /auth/registro", () => {

    afterAll(async () => {
        await prisma.usuario.deleteMany({
            where: {
                email: {
                    in: ["test@test.com", "test2@test.com"]
                }
            }
        });
    });

    it("deberia registrar un usuario exitosamente", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test",
                email: "test@test.com",
                password: "Castilla02",
                rol: "usuario",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).not.toHaveProperty("password");
    });

    it("deberia rechazar un email duplicado", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test",
                email: "test@test.com",
                password: "Castilla02",
                rol: "usuario",
            });

        expect(res.status).toBe(400);
    });

    it("deberia rechazar un registro sin email", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test",
                password: "Castilla02",
                rol: "usuario",
            });

        expect(res.status).toBe(400);
    });

    it("deberia rechazar un registro sin password", async () => {
        const res = await request(app)
            .post("/auth/registro")
            .send({
                nombre: "test",
                email: "test2@test.com",
                rol: "usuario",
            });

        expect(res.status).toBe(400);
    });
});
