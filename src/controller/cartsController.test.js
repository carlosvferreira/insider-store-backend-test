const request = require("supertest");
const mongoose = require("mongoose");
const { products } = require("../mocks/products");
const { setupFreshDb } = require("../config/dbSetup");
const app = require("express")();
const routes = require("../api/routes");
const Carts = require("../database/schemas/Carts");

const databaseConnectionString =
  process.env.DATABASE_URI_DEV || "mongodb://localhost/insider-store";

app.use(routes);

const goodPostCartBody = {
  codigo: "minimal-top",
  quantidade: 9,
};

const goodPostCartBodySameProductDifferentAmount = {
  codigo: "minimal-top",
  quantidade: 7,
};

const badAmountPostCartBody = {
  codigo: "minimal-top",
  quantidade: 0,
};

const badStructurePostCartBody = {
  codigo: "",
  quantidade: 11,
};

describe("test cartController with different success and failure scenarios", () => {
  beforeAll(async () => {
    await mongoose.connect(databaseConnectionString);
    await setupFreshDb(products);
  });
  afterAll(async () => {
    await setupFreshDb(products);
    await mongoose.connection.close();
  });

  let cartToken;
  let productId;
  let productCode;

  it("should return 201 and create a new cart with the expected structure", async () => {
    const response = await request(app)
      .post("/cart")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(goodPostCartBody);

    cartToken = response.body?.token;
    productId = response.body?.produtos?.[0]?._id;
    productCode = response.body?.produtos?.[0]?.codigo;

    expect(response.status).toBe(201);
    expect(response.body?.token).toBeDefined();
    expect(response.body?.itens_total).toBe(goodPostCartBody.quantidade);
    expect(response.body?.valor_total).toBe(1071);
  });

  it("should return 200 and expected cart data on body response", async () => {
    const response = await request(app)
      .get(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body?.token).toBe(cartToken);
    expect(response.body?.produtos?.[0]?._id).toBe(productId);
    expect(response.body?.itens_total).toBe(goodPostCartBody.quantidade);
    expect(response.body?.valor_total).toBe(1071);
  });

  it("should return 200 and expected empty response", async () => {
    const response = await request(app)
      .get("/cart/123")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it("should return 400 and expected error message", async () => {
    const spy = jest.spyOn(Carts, "findOne").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await request(app)
      .get(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.text).toEqual(
      JSON.stringify({
        error: "Oops",
        message:
          "Failed to return cart. Please try again later or contact our support team.",
      })
    );
    spy.mockRestore();
  });

  it("should return 200 and remove product from cart", async () => {
    const response = await request(app)
      .delete(`/cart/${cartToken}/${productCode}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body?.token).toBeDefined();
    expect(response.body?.token).toBe(cartToken);
    expect(response.body?.itens_total).toBe(0);
    expect(response.body?.valor_total).toBe(0);
    expect(response.body?.produtos).toEqual([]);
  });

  it("should return 200 and add product to cart", async () => {
    const response = await request(app)
      .post(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(goodPostCartBody);

    expect(response.status).toBe(200);
    expect(response.body?.token).toBeDefined();
    expect(response.body?.token).toBe(cartToken);
    expect(response.body?.itens_total).toBe(goodPostCartBody.quantidade);
    expect(response.body?.valor_total).toBe(1071);
  });

  it("should return 200 and update existing product on cart", async () => {
    const response = await request(app)
      .post(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(goodPostCartBodySameProductDifferentAmount);

    expect(response.status).toBe(200);
    expect(response.body?.token).toBeDefined();
    expect(response.body?.token).toBe(cartToken);
    expect(response.body?.itens_total).toBe(
      goodPostCartBodySameProductDifferentAmount.quantidade
    );
    expect(response.body?.valor_total).toBe(833);
  });

  it("should return 400 and expected error message", async () => {
    const response = await request(app)
      .post(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(badAmountPostCartBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        error: "Oops",
        message: "At least one item must be added.",
      })
    );
  });

  it("should return 400 and expected error message", async () => {
    const response = await request(app)
      .post(`/cart/${cartToken}`)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(badStructurePostCartBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "A code and an amount must be sent as parameters. Please verify your request and try again."
    );
  });
});
