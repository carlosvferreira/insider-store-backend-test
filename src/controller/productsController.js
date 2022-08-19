const {
  getProducts,
  getProduct,
  createProduct,
} = require("../services/products");

async function getProductsController(req, res, next) {
  try {
    const products = await getProducts();
    return res.send(products);
  } catch (err) {
    next(err);
  }
}

async function postProductsController(req, res, next) {
  const { codigo, imagem, valor, nome } = req.body;

  if (!Object.keys(req.body).includes("codigo", "imagem", "valor", "nome")) {
    res
      .status(400)
      .send(
        "Please include a code, image, value and name in the request body and try again."
      );
  }

  try {
    const productExists = await getProduct(codigo);
    if (productExists !== null) {
      return res.status(400).send({
        error: "Oops",
        message: "This product already exists",
      });
    }

    const product = await createProduct(codigo, imagem, valor, nome);

    return res.status(201).send(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProductsController,
  postProductsController,
};
