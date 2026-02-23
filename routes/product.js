const express = require("express");
const router = express.Router();
const Controller = require("../controllers");

// List
router.get("/", Controller.productList);

// Detail
router.get("/:id", Controller.productDetail);

// Add
router.get("/add", Controller.getAddProduct);
router.post("/add", Controller.postAddProduct);

// Edit
router.get("/:id/edit", Controller.getEditProduct);
router.post("/:id/edit", Controller.postEditProduct);

// Delete
router.post("/:id/delete", Controller.deleteProduct);

module.exports = router;
