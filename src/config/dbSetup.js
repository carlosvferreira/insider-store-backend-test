const mongoose = require("mongoose");
const Products = require("../database/schemas/Products");
const { products } = require("../mocks/products");

async function setupFreshDb() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const c of collections) {
    const collection = mongoose.connection.collections[c];
    await collection.deleteMany();
  }
  return await Products.insertMany(products, (err, docs) => {
    if (err) {
      return console.error(err);
    } else {
      console.log("Products table populated successfully.");
    }
  });
}

module.exports = { setupFreshDb };
