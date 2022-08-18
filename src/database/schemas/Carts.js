const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
  quantidade: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartsSchema = new mongoose.Schema({
  token: {
    type: String,
    default: uuidv4,
  },
  produtos: [productsSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Carts", cartsSchema);
