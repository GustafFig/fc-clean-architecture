import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: response.body.id,
      name: response.body.name,
      price: response.body.price,
    })
  });

  it("should return error if invalid name", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "",
        price: 100,
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Name is required")
  });

  it("should return error if price lower than 0", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "valid name",
        price: -1,
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Price must be greater than zero")
  });

  it("should list products", async () => {
    const res1 = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 100,
      });
    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .post("/product")
      .send({
        name: "Product 2",
        price: 1,
      });
    expect(res2.status).toBe(200);

    const response = await request(app)
      .get("/product")
      .send({});

    expect(response.status).toBe(200)
    expect(response.body.products[0]).toEqual({
      id: expect.any(String),
      name: "Product 1",
      price: 100,
    })
    expect(response.body.products[1]).toEqual({
      id: expect.any(String),
      name: "Product 2",
      price: 1,
    })
    expect(response.body.products[0].id).not.toBe(response.body.products[1].id);
  });
});
