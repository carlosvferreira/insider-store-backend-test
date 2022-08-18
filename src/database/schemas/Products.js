const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  imagem: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Products", productsSchema);
