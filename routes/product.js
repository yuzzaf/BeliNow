const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn, isAdmin } = require("../middlewares/middleware");

// Public
router.get("/", Controller.productList);

// Protected
router.use(isLoggedIn);
router.use(isAdmin);
router.get("/add", Controller.getAddProduct);
router.post("/add", Controller.postAddProduct);
router.get("/:id/edit", Controller.getEditProduct);
router.post("/:id/edit", Controller.postEditProduct);
router.post("/:id/delete", Controller.deleteProduct);

// Public detail (must be last so it does not catch /add)
router.get("/:id", Controller.productDetail);
module.exports = router;
