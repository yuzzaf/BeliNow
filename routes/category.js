const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/", Controller.categoryList);

router.get("/add", Controller.getAddCategory);
router.post("/add", Controller.postAddCategory);
router.get("/:id/delete", Controller.deleteCategory);
module.exports = router;
