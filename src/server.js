const express = require("express");
const routes = require("./api/routes");
const mongoose = require("mongoose");
const { products } = require("./mocks/products");
const { setupFreshDb } = require("./config/dbSetup");

mongoose.connect("mongodb://localhost/insider-store");
setupFreshDb(products);

const app = express();

const server = app.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log(`Server running on port ${port}`);
});

app.use(routes);

module.exports = app;
