const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/create", orderController.createOrder);

router.get("/get", orderController.getOrders);

router.put("/update/:id", orderController.updateOrderStatus);

router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
