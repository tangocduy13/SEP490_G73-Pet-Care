const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')

afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection
});

describe("POST /login", () => {
    test("wrong email or password", async () => {
        const response = await request(app).post("/login").send({
            email: "duytn123123@gmail.com",
            password: "mypass123@"
        })
        expect(response.statusCode).toBe(400)
    })
})


