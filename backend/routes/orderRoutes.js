const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/create", orderController.createOrder);
router.get("/get", orderController.getOrders);
router.delete("/delete/:id", orderController.deleteOrder);

module.exports = router;
