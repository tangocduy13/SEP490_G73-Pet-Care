const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
// reference link: https://www.npmjs.com/package/supertest
afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection
});

describe("POST /login", () => {
    describe("Không nhập email", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "",
                password: "Mypass1@"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Vui lòng nhập email")
        })
    })
    describe("Email nhập vào 1 khoảng trắng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "    ",
                password: "Mypass1@"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Vui lòng nhập email")
        })
    })
    describe("Email nhập sai định dạng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "duytn@@",
                password: "Mypass1@"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Email không hợp lệ")
        })
    })
    describe("Email không tồn tại", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "duytn@gmail.com",
                password: "Mypass1@"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Email không tồn tại")
        })
    })
    describe("Không nhập mật khẩu", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "tangocduy13@gmail.com",
                password: ""
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Bạn chưa nhập mật khẩu")
        })
    })
    describe("Mật khẩu nhập vào 1 khoảng trắng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "tangocduy13@gmail.com",
                password: "    "
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Bạn chưa nhập mật khẩu")
        })
    })
    describe("Đúng email sai mật khẩu", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/login").send({
                email: "tangocduy13@gmail.com",
                password: "mypass123@"
            })
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toEqual("Sai mật khẩu")
        })
    })
    describe("Đăng nhập thành công", () => {
        it("expect status code = 200", async () => {
            const response = await request(app).post("/login")
                .send({
                    email: "tangocduy13@gmail.com",
                    password: "Mypass1@"
                })
            expect(response.status).toEqual(200);
            expect(response.body.message).toEqual("Xin chào Tạ Ngọc Duy");
        })
    })
})


