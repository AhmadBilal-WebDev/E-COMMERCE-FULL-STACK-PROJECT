const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true }, // added
  phone: { type: String, required: true }, // added
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // added
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
