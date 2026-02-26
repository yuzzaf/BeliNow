const express = require("express");
const router = express.Router();
const productRoute = require("./product");
const categoryRoute = require("./category");
const orderRoute = require("./order");
const authRoute = require("./auth");
const profileRoute = require("./profiles");
const { isLoggedIn } = require("../middlewares/middleware");

router.get("/", (req, res) => {
  res.redirect("/products");
});

// Public routes
router.use("/", authRoute);
router.use("/products", productRoute);

// Protected routes
router.use(isLoggedIn);
router.use("/categories", categoryRoute);
router.use("/orders", orderRoute);
router.use("/profiles", profileRoute);

module.exports = router;
