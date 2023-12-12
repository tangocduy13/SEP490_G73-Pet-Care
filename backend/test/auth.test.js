const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose');

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
                email: "duytn123@gmail.com",
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

describe("POST /register", () => {
    describe("Không nhập tên hoặc nhập tên là khoảng trắng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "   ",
                    "email": "tangocduy@gmail.com",
                    "password": "Mypass@",
                    "passwordConfirm": "Mypass1",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Tên không được bỏ trống")
        })
    })
    describe("Không nhập email hoặc nhập email là khoảng trắng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "   ",
                    "password": "Mypass@",
                    "passwordConfirm": "Mypass1",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Email không được bỏ trống")
        })
    })
    describe("Email đã được sử dụng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "tangocduy13@gmail.com",
                    "password": "Mypass@123",
                    "passwordConfirm": "Mypass@123",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Email đã được sử dụng")
        })
    })
    describe("Không nhập mật khẩu hoặc nhập mật khẩu là khoảng trắng", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "duytn@gmail.com",
                    "password": "   ",
                    "passwordConfirm": "Mypass1",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Mật khẩu không được bỏ trống")
        })
    })
    describe("Mật khẩu có ít hơn 8 ký tự", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "duytn@gmail.com",
                    "password": "mypass1",
                    "passwordConfirm": "Mypass1",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Mật khẩu phải có độ dài từ 8 ký tự trở lên")
        })
    })
    describe("Mật khẩu không đủ mạnh", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "duytn@gmail.com",
                    "password": "mypass11111",
                    "passwordConfirm": "Mypass1",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Mật khẩu phải chứa ít nhật 1 chữ hoa, 1 ký tự đặc biệt và 1 chữ số")
        })
    })
    describe("Không xác nhận mật khẩu", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "tangocduy@gmail.com",
                    "password": "Qqq123123@",
                    "passwordConfirm": "    ",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng xác nhận mật khẩu");
        })
    })
    describe("Xác nhận mật khẩu sai", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "tangocduy@gmail.com",
                    "password": "Qqq123123@",
                    "passwordConfirm": "Qqq123123!",
                    "role": "customer"
                })
            expect(response.status).toEqual(400);
            expect(response.body.error).toEqual("Mật khẩu nhập lại không khớp");
        })
    })
    describe("Đăng ký thành công", () => {
        it("expect status code = 201", async () => {
            const response = await request(app).post("/register")
                .send({
                    "fullname": "Tạ Ngọc Duy",
                    "email": "tangocduy@gmail.com",
                    "password": "Qqq123123@",
                    "passwordConfirm": "Qqq123123@",
                    "role": "customer"
                })
            console.log(response.body)
            expect(response.status).toEqual(201);
            expect(response.body.message).toEqual("Đăng ký thành công");
        })
    })
})




