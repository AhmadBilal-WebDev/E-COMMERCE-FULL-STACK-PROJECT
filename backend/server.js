const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./config/db");
const router = require("./routes/userRouters");
const adminRoutes = require("./routes/adminRouter");
const productRoutes = require("./routes/productRoutes");
const path = require("path");
const adminProductRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.use("/api/users", router);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images
app.use("/api/products", productRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
