const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

// List
router.get("/", Controller.productList);


// Add
router.get("/add", Controller.getAddProduct);
router.post("/add", Controller.postAddProduct);

// Detail
router.get("/:id", Controller.productDetail);

// Edit
router.get("/:id/edit", Controller.getEditProduct);
router.post("/:id/edit", Controller.postEditProduct);

// Delete
router.post("/:id/delete", Controller.deleteProduct);

module.exports = router;
