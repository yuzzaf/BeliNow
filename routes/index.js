const express = require("express");
const router = express.Router();
const productRoute = require("./product");
const categoryRoute = require("./category");
const orderRoute = require("./order");
const authRoute = require("./auth");

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/", authRoute);
router.use("/orders", orderRoute);

module.exports = router;
