const Order = require("../models/orderModel");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, message: "Order placed!", order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const { username } = req.query;
    const orders = await Order.find({ username });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order cancelled!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
