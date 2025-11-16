const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");
const { adminValidation } = require("../validation/adminValidation");

router.post("/login", adminValidation, adminLogin);

module.exports = router;
