const express = require("express");
const router = express.Router();
const productRoute = require("./product");
const categoryRoute = require("./category");
const orderRoute = require("./order");
const authRoute = require("./auth");
const profileRoute = require("./profiles");

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/login", authRoute);
router.use("/orders", orderRoute);
router.use("/profiles", profileRoute);

module.exports = router;
