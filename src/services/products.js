const Carts = require("../database/schemas/Carts");
const Products = require("../database/schemas/Products");

async function getProducts() {
  try {
    const products = await Products.find({});
    if (!products) {
      return null;
    }

    return products;
  } catch (err) {
    throw new Error(
      "Failed to return products. Please try again later or contact our support team."
    );
  }
}

async function getProduct(codigo) {
  try {
    const product = await Products.findOne({ codigo });
    if (!product) {
      return null;
    }

    return product;
  } catch (err) {
    throw new Error(
      "Failed to return product. Please try again later or contact our support team."
    );
  }
}

async function createProduct(codigo, imagem, valor, nome) {
  try {
    const product = await Products.create({
      codigo,
      imagem,
      valor,
      nome,
    });

    return product;
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to create product. Please try again later or contact our support team."
    );
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
