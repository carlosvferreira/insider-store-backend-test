const express = require("express");
const routes = require("./api/routes");
const mongoose = require("mongoose");
const { setupFreshDb } = require("./config/dbSetup");

const databaseConnectionString =
  process.env.DATABASE_URI_PROD || "mongodb://localhost/insider-store";

mongoose.connect(databaseConnectionString);

setupFreshDb();

const app = express();

const server = app.listen(process.env.PORT || 0, () => {
  const { port } = server.address();
  console.log(`Server running on port ${port}`);
});

app.use(routes);

module.exports = app;
