const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn, isAdmin } = require("../middlewares/middleware");

// Public
router.get("/", Controller.productList);

// Admin only
router.get("/add", isLoggedIn, isAdmin, Controller.getAddProduct);
router.post("/add", isLoggedIn, isAdmin, Controller.postAddProduct);
router.get("/:id/edit", isLoggedIn, isAdmin, Controller.getEditProduct);
router.post("/:id/edit", isLoggedIn, isAdmin, Controller.postEditProduct);
router.post("/:id/delete", isLoggedIn, isAdmin, Controller.deleteProduct);

// Public detail (must be last so it does not catch /add)
router.get("/:id", Controller.productDetail);

module.exports = router;
