const express = require("express");
const router = express.Router();
const { signUp, logIn } = require("../controllers/userController");
const { signUpValidation, logInValidation } = require("../validation/userValidation");

router.post("/signup", signUpValidation, signUp);
router.post("/login", logInValidation, logIn);

module.exports = router;
