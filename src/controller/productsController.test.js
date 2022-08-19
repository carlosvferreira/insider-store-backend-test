const request = require("supertest");
const mongoose = require("mongoose");
const { products } = require("../mocks/products");
const { setupFreshDb } = require("../config/dbSetup");
const app = require("express")();
const routes = require("../api/routes");
const Products = require("../database/schemas/Products");

const databaseConnectionString =
  process.env.DATABASE_URI_DEV || "mongodb://localhost/insider-store";

app.use(routes);

const productsCodes = [
  "minimal-top",
  "tech-t-shirt",
  "tech-t-shirt-gola-v",
  "wingsuit",
];

const productExample = {
  codigo: "minimal-top-1",
  imagem:
    "https://cdn.shopify.com/s/files/1/0526/4123/5093/products/12_84036fc8-f5f9-48ab-a236-1ff4ba9cb38a_450x.png?v=1660254301",
  valor: 120,
  nome: "Minimal Top 1",
};

describe("test productsController with different success and failure scenarios", () => {
  beforeAll(async () => {
    await mongoose.connect(databaseConnectionString);
    await setupFreshDb(products);
  });
  afterAll(async () => {
    await setupFreshDb(products);
    await mongoose.connection.close();
  });

  it("should return 200 and expected products on body response", async () => {
    const response = await request(app)
      .get("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const responseProductsCodes = response.body?.map((p) => {
      return p.codigo;
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(responseProductsCodes.sort()).toEqual(productsCodes.sort());
    expect(response.body?.length).toBe(4);
  });

  it("should return 200 and expected products on body response", async () => {
    const spy = jest.spyOn(Products, "find").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await request(app)
      .get("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
    expect(response.text).toBe(
      "Unknown error. Please try again later or contact our support team."
    );

    spy.mockRestore();
  });

  it("should return 201 and create a new product with the expected structure", async () => {
    const response = await request(app)
      .post("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(productExample);

    expect(response.status).toBe(201);
    expect(response.body?._id).toBeDefined();
    expect(response.body?.codigo).toBe(productExample.codigo);
    expect(response.body?.valor).toBe(productExample.valor);
  });

  it("should return 400 and expected error message", async () => {
    const response = await request(app)
      .post("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(productExample);

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        error: "Oops",
        message: "Product already exists",
      })
    );
  });
});
