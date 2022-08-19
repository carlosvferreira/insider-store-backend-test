const Carts = require("../database/schemas/Carts");
const Products = require("../database/schemas/Products");

async function findCart(token) {
  try {
    const cart = await Carts.findOne({ token: token });
    if (!cart) {
      return null;
    }
    const totalAmount = cart.produtos
      ?.map((p) => {
        return p.valor * p.quantidade;
      })
      .reduce((a, b) => a + b, 0);
    const totalItems = cart.produtos
      ?.map((p) => {
        return p.quantidade;
      })
      .reduce((a, b) => a + b, 0);

    const response = {
      token: cart.token,
      valor_total: totalAmount,
      itens_total: totalItems,
      produtos: cart.produtos,
    };

    return response;
  } catch (err) {
    throw new Error(
      "Failed to return cart. Please try again later or contact our support team."
    );
  }
}

async function createCart(codigo_produto, quantidade) {
  if (quantidade > 10) {
    throw new Error(
      "The maximum allowed quantity for a specific item is 10. Please add up to 10 items and try again."
    );
  }
  try {
    const { codigo, imagem, valor, nome } = await Products.findOne({
      codigo: codigo_produto,
    });

    const newCart = await Carts.create({
      produtos: {
        codigo,
        imagem,
        valor,
        nome,
        quantidade,
      },
    });

    const totalAmount = newCart.produtos
      ?.map((p) => {
        return p.valor * p.quantidade;
      })
      .reduce((a, b) => a + b, 0);
    const totalItems = newCart.produtos
      ?.map((p) => {
        return p.quantidade;
      })
      .reduce((a, b) => a + b, 0);

    const response = {
      token: newCart.token,
      valor_total: totalAmount,
      itens_total: totalItems,
      produtos: newCart.produtos,
    };

    return response;
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to update cart. Please try again later or contact our support team."
    );
  }
}

async function updateCart(token, codigo_produto, quantidade) {
  if (quantidade > 10) {
    throw new Error(
      "The maximum allowed quantity for a specific item is 10. Please add up to 10 items and try again."
    );
  }
  try {
    const { codigo, imagem, valor, nome } = await Products.findOne({
      codigo: codigo_produto,
    });
    const cart = await Carts.findOne({ token: token });
    const currentProducts = new Set(
      ...[
        cart.produtos?.map((p) => {
          return p.codigo;
        }),
      ]
    );
    if (currentProducts.has(codigo)) {
      const updateItemAmount = await Carts.findOneAndUpdate(
        { codigo: codigo, "produtos.codigo": codigo },
        {
          $set: {
            updatedAt: new Date(),
            "produtos.$.updatedAt": new Date(),
            "produtos.$.quantidade": quantidade,
          },
        },
        { new: true }
      );

      const totalAmount = updateItemAmount.produtos
        ?.map((p) => {
          return p.valor * p.quantidade;
        })
        .reduce((a, b) => a + b, 0);
      const totalItems = updateItemAmount.produtos
        ?.map((p) => {
          return p.quantidade;
        })
        .reduce((a, b) => a + b, 0);

      const response = {
        token: updateItemAmount.token,
        valor_total: totalAmount,
        itens_total: totalItems,
        produtos: updateItemAmount.produtos,
      };

      return response;
    }

    const addNewItem = await Carts.findOneAndUpdate(
      { token: token },
      {
        $set: {
          updatedAt: new Date(),
        },
        $push: {
          produtos: {
            codigo,
            imagem,
            valor,
            nome,
            quantidade,
          },
        },
      },
      { new: true }
    );

    const totalAmount = addNewItem.produtos
      ?.map((p) => {
        return p.valor * p.quantidade;
      })
      .reduce((a, b) => a + b, 0);
    const totalItems = addNewItem.produtos
      ?.map((p) => {
        return p.quantidade;
      })
      .reduce((a, b) => a + b, 0);

    const response = {
      token: addNewItem.token,
      valor_total: totalAmount,
      itens_total: totalItems,
      produtos: addNewItem.produtos,
    };

    return response;
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to update cart. Please try again later or contact our support team."
    );
  }
}

async function deleteProductFromCart(token, codigo) {
  try {
    const removeItem = await Carts.findOneAndUpdate(
      { token: token },
      {
        $set: {
          updatedAt: new Date(),
        },
        $pull: {
          produtos: { codigo: codigo },
        },
      },
      { new: true }
    );

    const totalAmount = removeItem.produtos
      ?.map((p) => {
        return p.valor * p.quantidade;
      })
      .reduce((a, b) => a + b, 0);
    const totalItems = removeItem.produtos
      ?.map((p) => {
        return p.quantidade;
      })
      .reduce((a, b) => a + b, 0);

    const response = {
      token: removeItem.token,
      valor_total: totalAmount,
      itens_total: totalItems,
      produtos: removeItem.produtos,
    };

    return response;
  } catch (err) {
    throw new Error(
      err.message ||
        "Failed to delete product. Please try again later or contact our support team."
    );
  }
}

module.exports = {
  findCart,
  createCart,
  updateCart,
  deleteProductFromCart,
};
