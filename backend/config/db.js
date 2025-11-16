const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_DB;

mongoose.connect(mongoURI, {});

const db = mongoose.connection;

db.on("error", () => {
  console.log("Error in connecting!");
});
db.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});
db.on("disconnect", () => {
  console.log("⚠️ MongoDB disconnected");
});

module.exports = mongoose;
