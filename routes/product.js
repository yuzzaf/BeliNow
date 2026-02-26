const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/middleware");

// Public
router.get("/", Controller.productList);
router.get("/:id", Controller.productDetail);

// Protected
router.use(isLoggedIn);
router.get("/add", Controller.getAddProduct);
router.post("/add", Controller.postAddProduct);
router.get("/:id/edit", Controller.getEditProduct);
router.post("/:id/edit", Controller.postEditProduct);
router.post("/:id/delete", Controller.deleteProduct);

module.exports = router;
