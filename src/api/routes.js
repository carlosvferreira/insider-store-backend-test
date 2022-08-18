const app = require("express");
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

const routes = app.Router();

routes.get("/", (req, res) => {
  res.send({
    message:
      "Hi there! This is an API created as a test for a backend position at the Insider Store company.",
  });
});

routes.get("/products", getProductsController);

routes.post("/products", postProductsController);

routes.get("/cart/:token", findCartController);

routes.post("/cart/:token?", postCartsController);

routes.delete("/cart/:token/:code", deleteProductFromCartController);

routes.use(errorHandler);

module.exports = routes;
