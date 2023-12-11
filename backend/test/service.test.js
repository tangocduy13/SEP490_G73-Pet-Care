const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose');

// reference link: https://www.npmjs.com/package/supertest
afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection
});

describe("GET /service", () => {
    describe("get all service for customer", () => {
        it("expect status code = 200", async () => {
            const response = await request(app).get("/service")
            expect(response.statusCode).toEqual(200)
        })
    })
    describe("get all service for admin to manage", () => {
        it("expect status code = 200", async () => {
            const response = await request(app).get("/service/manage")
            expect(response.statusCode).toEqual(200)
        })
    })
})

describe("POST /service ", () => {
    describe("create new service", () => {
        it("Không nhập tên dịch vụ/ expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "    ",
                    "status": true,
                    "description": "    ",
                    "price": "200000",
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": ""
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập tên dịch vụ");
        })
        it("Tên dịch vụ chứa ký tự đặc biệt /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị@nấm",
                    "status": true,
                    "description": "nấm mèo",
                    "price": "200000",
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": ""
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Tên dịch vụ không chứa ký tự đặc biệt");
        })
        it("Không chọn trạng thái /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": "",
                    "description": "nấm mèo",
                    "price": "200000",
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": ""
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng chọn đúng trạng thái của dịch vụ");
        })
        it("Không nhập mô tả /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "    ",
                    "price": "200000",
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": ""
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập mô tả cho dịch vụ");
        })
        it("Không nhập giá /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "trị nấm cho mèo",
                    "price": "  ",
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": ""
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập giá");
        })
        it("Giá < 0 /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "trị nấm cho mèo",
                    "price": -200000,
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": "image.png"
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Giá phải lớn hơn 0");
        })
        it("Giá = 0 /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "trị nấm cho mèo",
                    "price": 0,
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": "image.png"
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Giá phải lớn hơn 0");
        })
        it("Chưa chọn loại dịch vụ /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "trị nấm cho mèo",
                    "price": 200000,
                    "categoryId": "     ",
                    "serviceImage": "image.png"
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng chọn loại dịch vụ");
        })
        it("Chưa chọn ảnh /expect status code = 400", async () => {
            const response = await request(app)
                .post("/service")
                .send({
                    "serviceName": "trị nấm",
                    "status": true,
                    "description": "trị nấm cho mèo",
                    "price": 200000,
                    "categoryId": "6537670854c530426554f6b3",
                    "serviceImage": "   "
                })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng chọn ảnh cho dịch vụ");
        })
    })
})

describe("PATCH /service", () => {
    describe("Update service", () => {
        it("Không nhận được service ID /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "     ",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng dại",
                "price": 100,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Không lấy được service ID");
        })
        it("Không nhập tên dịch vụ /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "    ",
                "status": true,
                "description": "tiêm vắc xin phòng dại",
                "price": 100000,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập tên dịch vụ");
        })
        it("Tên chứa ký tự đặc biệt /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm~vắc~xin",
                "status": true,
                "description": "tiêm vắc xin phòng dại",
                "price": 100,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Tên dịch vụ không chứa ký tự đặc biệt");
        })
        it("Chưa chọn status /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm~vắc~xin",
                "status": "abc",
                "description": "tiêm vắc xin phòng dại",
                "price": 100,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Tên dịch vụ không chứa ký tự đặc biệt");
        })
        it("Không nhập mô tả cho dịch vụ /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "    ",
                "price": 100,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập mô tả cho dịch vụ")
        })
        it("Không nhập giá /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": "",
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập giá")
        })
        it("Giá = 0 /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": 0,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Giá phải là một số lớn hơn 0")
        })
        it("Giá < 0 /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": -100000,
                "saleStartTime": "2023-11-12",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Giá phải là một số lớn hơn 0")
        })
        it("Ngày bắt đầu sale nhập vào 1 khoảng trắng /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": 100000,
                "saleStartTime": "  ",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD")
        })
        it("Ngày bắt đầu sale nhập sai định dạng ngày tháng /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": 100000,
                "saleStartTime": "11-11-2023",
                "saleEndTime": "2023-11-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD")
        })
        it("Ngày kết thúc sale nhập vào 1 khoảng trắng /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-11",
                "saleEndTime": "    ",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD")
        })
        it("Ngày kết thúc sale nhập sai định dạng ngày tháng /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm vắc xin phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-11",
                "saleEndTime": "12-12-2023",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD")
        })
        it("Ngày bắt đầu sau ngày kết thúc /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-15",
                "saleEndTime": "2023-12-11",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Thời gian sale kết thúc phải sau thời gian sale bắt đầu")
        })
        it("Nhập discount < 0 /expect status code = 400", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-15",
                "saleEndTime": "2023-12-20",
                "discount": -20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Nhập một số trong khoảng từ 0 đến 100")
        })
        it("Không chọn loại dịch vụ", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-15",
                "saleEndTime": "2023-12-20",
                "discount": 20,
                "categoryId": "     ",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(400);
            expect(response.body.error).toEqual("Vui lòng chọn loại dịch vụ");
        })
        it("Update dịch vụ thành công", async () => {
            const response = await request(app).patch("/service").send({
                "id": "653845dd0b2144641d76a5d8",
                "serviceName": "tiêm vắc xin",
                "status": true,
                "description": "tiêm phòng bệnh",
                "price": 100000,
                "saleStartTime": "2023-12-15",
                "saleEndTime": "2023-12-20",
                "discount": 20,
                "categoryId": "6537670854c530426554f6b3",
                "serviceImage": "updateImage.png"
            })
            expect(response.statusCode).toEqual(201);
            expect(response.body.message).toEqual("Updated service tiêm vắc xin");
        })
    })
})