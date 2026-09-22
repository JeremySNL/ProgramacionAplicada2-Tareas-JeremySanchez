import request from "supertest"
import app from "../../src/app.js"
import { prisma } from "../../src/db.js"

describe("POST /v1/tareas", () => {

    let usuarioId

    beforeAll(async () => {
        const usuario = await prisma.usuario.create({
            data: {
                nombre: "Usuario Test V1",
                email: "v1@test.com",
                password: "123456",
                rol: "usuario"
            }
        })

        usuarioId = usuario.id
    })

    afterAll(async () => {
        await prisma.tarea.deleteMany({
            where: {
                usuarioId: usuarioId
            }
        })

        await prisma.usuario.delete({
            where: {
                id: usuarioId
            }
        })
    })

    test("deberia crear una tarea con API Key valida", async () => {
        const res = await request(app)
            .post("/v1/tareas")
            .set("x-api-key", process.env.API_KEY)
            .send({
                titulo: "Tarea de prueba",
                usuarioId: usuarioId
            })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id")
        expect(res.body.titulo).toBe("Tarea de prueba")
    })

    test("deberia rechazar una tarea sin titulo", async () => {
        const res = await request(app)
            .post("/v1/tareas")
            .set("x-api-key", process.env.API_KEY)
            .send({
                usuarioId: usuarioId
            })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("error")
    })

    test("deberia rechazar una peticion sin API Key", async () => {
        const res = await request(app)
            .post("/v1/tareas")
            .send({
                titulo: "Tarea de prueba",
                usuarioId: usuarioId
            })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty("error")
    })
})