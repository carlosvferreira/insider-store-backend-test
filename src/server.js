const express = require("express");
const routes = require("./api/routes");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/insider-store");

const app = express();

const server = app.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log(`Server running on port ${port}`);
});

app.use(express.json());
app.use(routes);

module.exports = app;
