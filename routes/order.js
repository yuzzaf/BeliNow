const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/middleware");

router.get("/", isLoggedIn, Controller.orderList);

router.post("/create", Controller.createOrder);

router.get("/:id", isLoggedIn, Controller.orderDetail);

module.exports = router;
