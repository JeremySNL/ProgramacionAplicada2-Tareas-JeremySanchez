import request from "supertest"
import app from "../../src/app.js"

describe("GET /v1/tareas", () => {

    test("deberia obtener las tareas con API Key valida", async () => {
        const res = await request(app)
            .get("/v1/tareas")
            .set("x-api-key", process.env.API_KEY)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    test("deberia rechazar una peticion sin API Key", async () => {
        const res = await request(app)
            .get("/v1/tareas")

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty("error")
    })

    test("deberia rechazar una API Key incorrecta", async () => {
        const res = await request(app)
            .get("/v1/tareas")
            .set("x-api-key", "api-key-incorrecta")

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty("error")
    })
})