const Carts = require("../database/schemas/Carts");
const Products = require("../database/schemas/Products");
const {
  findCart,
  createCart,
  updateCart,
  deleteProductFromCart,
} = require("../services/carts");

async function findCartController(req, res, next) {
  const { token } = req.params;
  try {
    const cart = await findCart(token);
    return res.send(cart);
  } catch (err) {
    next(err);
  }
}

async function postCartsController(req, res, next) {
  const { codigo, quantidade } = req.body;
  const { token } = req.params;

  try {
    if (quantidade < 1) {
      throw new Error("At least one item must be added.");
    }

    const cartExists = await Carts.findOne({ token });

    if (!!cartExists) {
      const addProduct = await updateCart(token, codigo, quantidade);
      return res.send(addProduct);
    }

    const newCart = await createCart(codigo, quantidade);

    return res.status(201).send(newCart);
  } catch (err) {
    next(err);
  }
}

async function deleteProductFromCartController(req, res, next) {
  const { token, code } = req.params;
  if (!token || !code) {
    return res
      .status(400)
      .send("Invalid parameters. Please verify your request and try again.");
  }
  try {
    const removeItem = await deleteProductFromCart(token, code);
    return res.send(removeItem);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postCartsController,
  findCartController,
  deleteProductFromCartController,
};
