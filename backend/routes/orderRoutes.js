const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// CREATE ORDER
router.post("/create", orderController.createOrder);

// GET ALL ORDERS
router.get("/get", orderController.getOrders);

// UPDATE ORDER STATUS
router.put("/update/:id", orderController.updateOrderStatus);

// DELETE ORDER
router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
