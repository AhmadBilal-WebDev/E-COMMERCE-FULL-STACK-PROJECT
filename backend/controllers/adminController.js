const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

const ADMIN_USERNAME = "admin@company";
const ADMIN_PASSWORD = "123456";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "9f5uDW@b";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";

const adminLogin = async (req, res) => {
  try {
    const { username, password, secretCode } = req.body;
    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD ||
      secretCode !== ADMIN_SECRET
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid username, password, or secret code.",
      });
    }

    let admin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      admin = new Admin({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
      });
      await admin.save();
    }

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully.",
      data: { username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { adminLogin };
