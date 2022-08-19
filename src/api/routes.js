const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler");
const {
  findCartController,
  postCartsController,
  deleteProductFromCartController,
} = require("../controller/cartsController");
const {
  getProductsController,
  postProductsController,
} = require("../controller/productsController");

const routes = express.Router();

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.get("/", (req, res) => {
  res.send({
    message:
      "Hi there! This is an API created as a test for a backend position at the Insider Store company.",
  });
});

//Product endpoints
routes.get("/products", getProductsController);
routes.post("/products", postProductsController);

//Cart endpoints
routes.get("/cart/:token", findCartController);
routes.post("/cart/:token?", postCartsController);
routes.delete("/cart/:token/:code", deleteProductFromCartController);

routes.use(errorHandler);

module.exports = routes;
