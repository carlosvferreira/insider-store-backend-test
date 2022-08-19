const Carts = require("../database/schemas/Carts");

const {
  findCart,
  createCart,
  updateCart,
  deleteProductFromCart,
} = require("../services/carts");

async function findCartController(req, res, next) {
  const { token } = req.params;
  if (!token) {
    res
      .status(400)
      .send(
        "A token must be sent as a parameter. Please verify your request and try again."
      );
  }
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

  if (!codigo || isNaN(parseInt(quantidade))) {
    res
      .status(400)
      .send(
        "A code and an amount must be sent as parameters. Please verify your request and try again."
      );
  }

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
      .send(
        "A token and a code must be sent as parameters. Please verify your request and try again."
      );
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
