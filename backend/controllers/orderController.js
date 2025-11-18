const Order = require("../models/orderModel");
const User = require("../models/userModel");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { username, productId, productName, image, size, price } = req.body;

    // Fetch user details
    const user = await User.findOne({ name: username });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const order = new Order({
      username,
      email: user.email, // save email
      phone: user.phone, // save phone
      productId,
      productName,
      image,
      size,
      price,
      status: "Pending", // default status
    });

    await order.save();
    res.json({ success: true, message: "Order placed!", order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET ALL ORDERS (for admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ORDER STATUS (accept/reject)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted' or 'Rejected'

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    res.json({
      success: true,
      message: `Order ${status.toLowerCase()} successfully!`,
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
