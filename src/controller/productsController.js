const Products = require("../database/schemas/Products");

async function getProductsController(req, res, next) {
  try {
    const products = await Products.find({});
    return res.send(products);
  } catch (err) {
    next(err);
  }
}

async function postProductsController(req, res, next) {
  const { codigo, imagem, valor, nome } = req.body;

  try {
    const productExists = await Products.findOne({ codigo });

    if (productExists !== null) {
      return res.status(400).send({
        error: "Oops",
        message: "Product already exists",
      });
    }

    const product = await Products.create({
      codigo,
      imagem,
      valor,
      nome,
    });

    return res.status(201).send(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProductsController,
  postProductsController,
};
