const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const signUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(401).json({
        success: false,
        field: "email",
        message: "Email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    res
      .status(200)
      .json({ success: true, message: "Signup successful!", data: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(401).json({
        success: false,
        field: "email",
        message: "Email does not exist!",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({
        success: false,
        field: "password",
        message: "Invalid password!",
      });

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signUp, logIn };
